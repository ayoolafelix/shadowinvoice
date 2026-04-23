export interface TrustScoreInput {
  transactionCount: number;
  totalVolume: number;
  uniqueCounterparties: number;
  accountAge: number;
  inflowConsistency: number;
  outflowConsistency: number;
  anomalyCount: number;
}

export interface TrustScoreResult {
  score: number;
  label: "Trusted" | "Neutral" | "Risk";
  factors: {
    volumeScore: number;
    counterpartiesScore: number;
    activityScore: number;
    stabilityScore: number;
  };
}

export function calculateTrustScore(input: TrustScoreInput): TrustScoreResult {
  const {
    transactionCount,
    totalVolume,
    uniqueCounterparties,
    accountAge,
    inflowConsistency,
    outflowConsistency,
    anomalyCount,
  } = input;

  const volumeScore = Math.min(25, (Math.log10(totalVolume + 1) / 10) * 25);
  const counterpartiesScore = Math.min(25, (uniqueCounterparties / 50) * 25);
  const activityScore = Math.min(25, (Math.log10(transactionCount + 1) / 5) * 25);
  const stabilityScore = Math.min(25, ((inflowConsistency + outflowConsistency) / 2) * 25);

  let score = volumeScore + counterpartiesScore + activityScore + stabilityScore;

  const ageBonus = Math.min(10, accountAge / 30);
  score += ageBonus;

  if (anomalyCount > 0) {
    score -= Math.min(30, anomalyCount * 10);
  }

  score = Math.max(0, Math.min(100, score));

  let label: "Trusted" | "Neutral" | "Risk";
  if (score >= 70) label = "Trusted";
  else if (score >= 40) label = "Neutral";
  else label = "Risk";

  return {
    score: Math.round(score),
    label,
    factors: {
      volumeScore: Math.round(volumeScore),
      counterpartiesScore: Math.round(counterpartiesScore),
      activityScore: Math.round(activityScore),
      stabilityScore: Math.round(stabilityScore),
    },
  };
}

export function getTrustColor(score: number): string {
  if (score >= 70) return "text-emerald-500";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

export function getTrustBgColor(score: number): string {
  if (score >= 70) return "bg-emerald-50 border-emerald-200";
  if (score >= 40) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}