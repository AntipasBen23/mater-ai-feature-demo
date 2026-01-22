import { Material } from '@/data/mockMaterials';

export interface PriorityWeights {
  efficiency: number; // predictedZT
  cost: number; // lower cost = higher score
  synthesisComplexity: number; // lower complexity = higher score
  toxicity: number; // lower toxicity = higher score
  availability: number; // higher availability = higher score
  novelty: number; // higher novelty = higher score
  commercialViability: number; // higher viability = higher score
  synthesisTime: number; // shorter time = higher score
}

export const defaultWeights: PriorityWeights = {
  efficiency: 0.25,
  cost: 0.15,
  synthesisComplexity: 0.15,
  toxicity: 0.10,
  availability: 0.10,
  novelty: 0.10,
  commercialViability: 0.10,
  synthesisTime: 0.05,
};

// Normalize values to 0-10 scale
const normalizeZT = (zt: number): number => {
  // ZT typically ranges from 0 to 3, normalize to 0-10
  return Math.min((zt / 3) * 10, 10);
};

const normalizeCost = (cost: number): number => {
  // Lower cost is better, invert the score
  // Assuming max cost is around 5000
  const maxCost = 5000;
  return Math.max(0, 10 - (cost / maxCost) * 10);
};

const normalizeComplexity = (complexity: 'Low' | 'Medium' | 'High'): number => {
  // Lower complexity is better
  const complexityMap = {
    Low: 10,
    Medium: 6,
    High: 3,
  };
  return complexityMap[complexity];
};

const normalizeToxicity = (toxicity: number): number => {
  // Lower toxicity is better, invert the score
  return 10 - toxicity;
};

const normalizeSynthesisTime = (days: number): number => {
  // Shorter time is better, invert
  // Assuming max time is around 30 days
  const maxDays = 30;
  return Math.max(0, 10 - (days / maxDays) * 10);
};

export interface ScoredMaterial extends Material {
  priorityScore: number;
  breakdown: {
    efficiency: number;
    cost: number;
    synthesisComplexity: number;
    toxicity: number;
    availability: number;
    novelty: number;
    commercialViability: number;
    synthesisTime: number;
  };
}

export const calculatePriorityScore = (
  material: Material,
  weights: PriorityWeights = defaultWeights
): ScoredMaterial => {
  // Normalize all metrics to 0-10 scale
  const normalizedScores = {
    efficiency: normalizeZT(material.predictedZT),
    cost: normalizeCost(material.estimatedCost),
    synthesisComplexity: normalizeComplexity(material.synthesisComplexity),
    toxicity: normalizeToxicity(material.toxicityScore),
    availability: material.availabilityScore,
    novelty: material.noveltyScore,
    commercialViability: material.commercialViability,
    synthesisTime: normalizeSynthesisTime(material.estimatedSynthesisTime),
  };

  // Calculate weighted score
  const priorityScore =
    normalizedScores.efficiency * weights.efficiency +
    normalizedScores.cost * weights.cost +
    normalizedScores.synthesisComplexity * weights.synthesisComplexity +
    normalizedScores.toxicity * weights.toxicity +
    normalizedScores.availability * weights.availability +
    normalizedScores.novelty * weights.novelty +
    normalizedScores.commercialViability * weights.commercialViability +
    normalizedScores.synthesisTime * weights.synthesisTime;

  return {
    ...material,
    priorityScore: Number(priorityScore.toFixed(2)),
    breakdown: normalizedScores,
  };
};

export const rankMaterials = (
  materials: Material[],
  weights: PriorityWeights = defaultWeights
): ScoredMaterial[] => {
  const scoredMaterials = materials.map((material) =>
    calculatePriorityScore(material, weights)
  );

  // Sort by priority score (highest first)
  return scoredMaterials.sort((a, b) => b.priorityScore - a.priorityScore);
};

// Calculate ROI metric: efficiency gain vs. cost
export const calculateROI = (material: Material): number => {
  // Simple ROI: ZT improvement per £1000 spent
  const industryStandard = 1.0; // Bismuth telluride standard
  const ztImprovement = Math.max(0, material.predictedZT - industryStandard);
  const costInThousands = material.estimatedCost / 1000;
  
  if (costInThousands === 0) return 0;
  
  return Number((ztImprovement / costInThousands).toFixed(2));
};

// Get top N materials for synthesis recommendation
export const getTopCandidates = (
  materials: Material[],
  count: number = 5,
  weights?: PriorityWeights
): ScoredMaterial[] => {
  const ranked = rankMaterials(materials, weights);
  // Only return queued materials
  return ranked.filter((m) => m.status === 'Queued').slice(0, count);
};