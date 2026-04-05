const Log = require('../models/Log');
const Tank = require('../models/Tank');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FISH_DB = require('../data/fishData');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeWithAI = async (fish, temp, ph, turbidity, ammonia) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are an expert aquarium health advisor. A fish owner has a ${fish.name} fish.
Safe ranges for this fish: Temperature ${fish.tempMin}-${fish.tempMax}°C, pH ${fish.phMin}-${fish.phMax}, Ammonia ≤${fish.ammMax} ppm.
Current readings: Temperature ${temp}°C, pH ${ph}, Turbidity ${turbidity}, Ammonia ${ammonia} ppm.
Give a short 2-3 sentence analysis of the water quality. Mention any issues and one actionable tip. Be direct and friendly.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    // Fallback rule-based analysis
    const fish_data = fish;
    const issues = [];
    if (temp < fish_data.tempMin || temp > fish_data.tempMax) issues.push(`temperature (safe: ${fish_data.tempMin}-${fish_data.tempMax}°C)`);
    if (ph < fish_data.phMin || ph > fish_data.phMax) issues.push(`pH (safe: ${fish_data.phMin}-${fish_data.phMax})`);
    if (ammonia > fish_data.ammMax) issues.push(`ammonia (should be ≤${fish_data.ammMax} ppm)`);
    if (turbidity !== 'Clear') issues.push('water clarity');
    if (issues.length === 0) return `All parameters are within safe range for your ${fish_data.name}. Great job maintaining your tank!`;
    return `Warning: ${issues.join(', ')} ${issues.length > 1 ? 'are' : 'is'} out of safe range for your ${fish_data.name}. Please take corrective action and monitor closely.`;
  }
};

const computeStatus = (fish, temp, ph, ammonia, turbidity) => {
  const tOk = temp >= fish.tempMin && temp <= fish.tempMax;
  const phOk = ph >= fish.phMin && ph <= fish.phMax;
  const ammOk = ammonia <= fish.ammMax;
  const turbOk = turbidity === 'Clear';
  const badCount = [tOk, phOk, ammOk, turbOk].filter(v => !v).length;
  if (badCount === 0) return 'good';
  if (badCount <= 1) return 'warn';
  return 'critical';
};

const createLog = async (req, res) => {
  try {
    const { tankId, temperature, ph, turbidity, ammonia } = req.body;
    const tank = await Tank.findOne({ _id: tankId, user: req.user._id });
    if (!tank) return res.status(404).json({ message: 'Tank not found' });

    const fish = FISH_DB.find(f => f.id === tank.fishId) || FISH_DB[0];
    const status = computeStatus(fish, temperature, ph, ammonia, turbidity);
    const aiAnalysis = await analyzeWithAI(fish, temperature, ph, turbidity, ammonia);

    const log = await Log.create({
      tank: tankId, user: req.user._id,
      temperature, ph, turbidity, ammonia, status, aiAnalysis
    });

    res.status(201).json({ ...log.toObject(), aiAnalysis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLogs = async (req, res) => {
  try {
    const { tankId } = req.query;
    const query = { user: req.user._id };
    if (tankId) query.tank = tankId;
    const logs = await Log.find(query).sort({ loggedAt: -1 }).limit(30);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createLog, getLogs };
