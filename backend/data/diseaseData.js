const DISEASES = [
  {
    name: 'Ich (White Spot Disease)',
    symptoms: ['white_spots', 'scratching', 'clamped_fins', 'lethargy'],
    confidence: 92,
    dos: ['Raise water temperature gradually to 28°C', 'Add aquarium salt (1 tbsp per 5 gallons)', 'Use Ich medication', 'Increase aeration'],
    donts: ['Do not use copper if you have snails or plants', 'Do not do full water change', 'Do not isolate in cold water']
  },
  {
    name: 'Fin Rot',
    symptoms: ['torn_fins', 'discoloration', 'lethargy', 'not_eating'],
    confidence: 88,
    dos: ['Do 25% water change immediately', 'Add aquarium salt', 'Use antibacterial medication', 'Improve water quality'],
    donts: ['Do not keep with fin-nipping fish', 'Do not ignore early signs', 'Do not overdose medication']
  },
  {
    name: 'Swim Bladder Disorder',
    symptoms: ['swimming_sideways', 'floating', 'sinking', 'bloating'],
    confidence: 85,
    dos: ['Fast the fish for 2–3 days', 'Feed cooked peeled peas after fasting', 'Ensure stable water temperature'],
    donts: ['Do not overfeed', 'Do not add salt unless needed', 'Do not use medications immediately']
  },
  {
    name: 'Velvet Disease',
    symptoms: ['gold_dust', 'scratching', 'clamped_fins', 'rapid_breathing'],
    confidence: 87,
    dos: ['Dim the lights', 'Use copper-based medication', 'Raise temperature to 30°C', 'Quarantine infected fish'],
    donts: ['Do not use copper near invertebrates', 'Do not skip treatment course']
  },
  {
    name: 'Dropsy',
    symptoms: ['bloating', 'raised_scales', 'lethargy', 'not_eating'],
    confidence: 80,
    dos: ['Isolate fish immediately', 'Add 1 tsp aquarium salt per gallon', 'Use antibiotic treatment'],
    donts: ['Do not return to main tank until recovered', 'Do not overcrowd tank']
  },
  {
    name: 'Ammonia Poisoning',
    symptoms: ['gasping_surface', 'red_gills', 'lethargy', 'rapid_breathing'],
    confidence: 94,
    dos: ['Do 30–50% water change immediately', 'Use ammonia detoxifier', 'Check and fix filtration', 'Reduce feeding'],
    donts: ['Do not delay — ammonia damages gills fast', 'Do not overfeed']
  },
  {
    name: 'Columnaris (Bacterial Infection)',
    symptoms: ['white_patches', 'frayed_fins', 'not_eating', 'discoloration'],
    confidence: 82,
    dos: ['Isolate affected fish', 'Use antibacterial treatment', 'Improve water quality', 'Lower temperature slightly'],
    donts: ['Do not raise temperature — it speeds bacterial growth', 'Do not delay treatment']
  },
];

module.exports = DISEASES;
