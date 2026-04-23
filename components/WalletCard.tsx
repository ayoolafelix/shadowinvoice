"use client";

import Link from "next/link";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { formatAddress, formatUsd, formatCompactNumber } from "@/lib/formatters";
import { DuneWalletData } from "@/lib/simClient";

interface WalletCardProps {
  data: DuneWalletData;
  showDetails?: boolean;
}

export function WalletCard({ data, showDetails = true }: WalletCardProps) {
  const { balance, metrics } = data;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Wallet Address</p>
            <Link
              href={`/wallet/${balance.address}`}
              className="font-mono text-sm text-slate-900 hover:text-cyan-600 transition-colors"
            >
              {formatAddress(balance.address)}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">PUSD Balance</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatUsd(balance.pusdBalance)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">SOL Balance</p>
            <p className="text-lg font-semibold text-slate-900">
              {balance.solBalance.toFixed(4)}
            </p>
          </div>
        </div>

        {showDetails && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <p className="text-xs text-slate-500">Txns</p>
                <p className="font-semibold text-slate-900">
                  {formatCompactNumber(metrics.transactionCount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Received</p>
                <p className="font-semibold text-emerald-600">
                  {formatUsd(metrics.totalReceived)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Sent</p>
                <p className="font-semibold text-red-600">
                  {formatUsd(metrics.totalSent)}
                </p>
              </div>
            </div>

            <Link
              href={`/wallet/${balance.address}`}
              className="block w-full text-center bg-cyan-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
            >
              View Details
            </Link>
          </>
        )}
      </div>
    </div>
  );
}