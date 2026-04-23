"use client";

import { getTrustColor, getTrustBgColor } from "@/lib/trustScore";

interface TrustScoreBadgeProps {
  score: number;
  label: "Trusted" | "Neutral" | "Risk";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function TrustScoreBadge({
  score,
  label,
  size = "md",
  showLabel = true,
}: TrustScoreBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const scoreSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={`inline-flex flex-col items-center justify-center rounded-xl border ${getTrustBgColor(
        score
      )} ${sizeClasses[size]}`}
    >
      <div className={`font-bold ${getTrustColor(score)} ${scoreSizeClasses[size]}`}>
        {score}
      </div>
      {showLabel && (
        <div className={`text-xs font-medium ${getTrustColor(score)} mt-1`}>
          {label}
        </div>
      )}
    </div>
  );
}

interface TrustScoreBarProps {
  score: number;
  label?: string;
}

export function TrustScoreBar({ score, label }: TrustScoreBarProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{label}</span>
          <span className={`font-medium ${getTrustColor(score)}`}>{score}</span>
        </div>
      )}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            score >= 70
              ? "bg-emerald-500"
              : score >= 40
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}