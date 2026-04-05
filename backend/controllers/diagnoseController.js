const Diagnosis = require('../models/Diagnosis');
const Tank = require('../models/Tank');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FISH_DB = require('../data/fishData');
const DISEASES = require('../data/diseaseData');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const diagnoseWithAI = async (fishName, symptoms) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are an expert aquarium disease specialist. A ${fishName} fish is showing these symptoms: ${symptoms.join(', ')}.
Respond ONLY in this JSON format (no markdown, no extra text):
{
  "disease": "Disease name",
  "confidence": 85,
  "dos": ["action 1", "action 2", "action 3", "action 4"],
  "donts": ["avoid 1", "avoid 2", "avoid 3"],
  "explanation": "2 sentence explanation of this disease and why these symptoms match"
}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (err) {
    // Fallback rule-based
    let best = null, bestScore = 0;
    DISEASES.forEach(d => {
      const match = d.symptoms.filter(s => symptoms.includes(s)).length;
      const score = match / Math.max(d.symptoms.length, symptoms.length);
      if (score > bestScore) { bestScore = score; best = d; }
    });
    if (!best || bestScore < 0.1) {
      return { disease: 'No specific disease detected', confidence: 0, dos: ['Monitor fish closely', 'Check water parameters', 'Ensure proper feeding'], donts: ['Do not add medications without diagnosis'], explanation: 'Symptoms do not match a known disease pattern clearly. Monitor the fish.' };
    }
    return { disease: best.name, confidence: Math.round(best.confidence * bestScore * 1.5), dos: best.dos, donts: best.donts, explanation: `Based on the symptoms, this appears to be ${best.name}. Follow the treatment guidelines carefully.` };
  }
};

const runDiagnosis = async (req, res) => {
  try {
    const { tankId, symptoms, fishName } = req.body;
    if (!symptoms || symptoms.length === 0)
      return res.status(400).json({ message: 'Please provide at least one symptom' });

    const tank = await Tank.findOne({ _id: tankId, user: req.user._id });
    if (!tank) return res.status(404).json({ message: 'Tank not found' });

    const targetFishName = fishName || tank.fishName || 'Unknown Fish';

    const result = await diagnoseWithAI(targetFishName, symptoms);

    const diagnosis = await Diagnosis.create({
      tank: tankId, user: req.user._id,
      fishName: targetFishName, symptoms,
      disease: result.disease,
      confidence: result.confidence,
      dos: result.dos,
      donts: result.donts,
      aiResponse: result.explanation
    });

    res.status(201).json(diagnosis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDiagnoses = async (req, res) => {
  try {
    const { tankId } = req.query;
    const query = { user: req.user._id };
    if (tankId) query.tank = tankId;
    const diagnoses = await Diagnosis.find(query).sort({ diagnosedAt: -1 }).limit(20);
    res.json(diagnoses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { runDiagnosis, getDiagnoses };
