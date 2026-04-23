"use client";

import { formatAddress, formatUsd, formatCompactNumber } from "@/lib/formatters";

interface RiskWallet {
  address: string;
  riskType: "high_velocity" | "low_trust" | "new_volume";
  riskScore: number;
  volume24h: number;
  txnCount24h: number;
  label: string;
}

interface RiskPanelProps {
  wallets: RiskWallet[];
  title?: string;
}

export function RiskPanel({ wallets, title = "Risk Detection" }: RiskPanelProps) {
  const getRiskIcon = (riskType: string) => {
    switch (riskType) {
      case "high_velocity":
        return "🚀";
      case "low_trust":
        return "⚠️";
      case "new_volume":
        return "🆕";
      default:
        return "❓";
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return "text-red-600 bg-red-50 border-red-200";
    if (riskScore >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">
          Wallets with abnormal activity patterns
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {wallets.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No risk indicators detected
          </div>
        ) : (
          wallets.map((wallet) => (
            <div key={wallet.address} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getRiskIcon(wallet.riskType)}</span>
                  <div>
                    <p className="font-mono text-sm text-slate-900">
                      {formatAddress(wallet.address)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                        {wallet.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border ${getRiskColor(wallet.riskScore)}`}>
                  <span className="font-semibold">{wallet.riskScore}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-slate-500">24h Volume</p>
                  <p className="font-medium text-slate-900">{formatUsd(wallet.volume24h)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">24h Transactions</p>
                  <p className="font-medium text-slate-900">{formatCompactNumber(wallet.txnCount24h)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Risk Type</p>
                  <p className="font-medium text-slate-900 capitalize">
                    {wallet.riskType.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}