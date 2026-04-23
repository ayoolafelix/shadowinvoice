"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { simClient, DuneWalletData, Transaction } from "@/lib/simClient";
import { calculateTrustScore } from "@/lib/trustScore";
import { TrustScoreBadge, TrustScoreBar } from "@/components/TrustScoreBadge";
import { TransactionFeed } from "@/components/TransactionFeed";
import { formatUsd, formatAddress, formatTimestamp, formatCompactNumber } from "@/lib/formatters";
import Link from "next/link";
import { clsx } from "clsx";

export default function WalletPage() {
  const params = useParams();
  const address = params.address as string;
  const [walletData, setWalletData] = useState<DuneWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  useEffect(() => {
    const loadWallet = async () => {
      setIsLoading(true);
      const data = await simClient.getFullWalletData(address);
      setWalletData(data);
      setLastUpdated(Date.now());
      setIsLoading(false);
    };

    loadWallet();

    const unsubscribe = simClient.subscribeToWallet(address, (data) => {
      setWalletData(data);
      setLastUpdated(Date.now());
    }, 10000);

    return unsubscribe;
  }, [address]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 rounded-xl"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Wallet not found</p>
      </div>
    );
  }

  const { balance, transactions, metrics } = walletData;

  const accountAge = Math.floor(
    (Date.now() / 1000 - metrics.firstActivity) / 86400
  );

  const trustScore = calculateTrustScore({
    transactionCount: metrics.transactionCount,
    totalVolume: metrics.totalReceived + metrics.totalSent,
    uniqueCounterparties: metrics.uniqueCounterparties,
    accountAge,
    inflowConsistency: 0.7,
    outflowConsistency: 0.6,
    anomalyCount: 0,
  });

  const recentTransactions = transactions.slice(0, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wallet Intelligence</h1>
          <p className="font-mono text-slate-500 mt-1">{formatAddress(address, 8)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Last updated</p>
          <p className="text-sm text-slate-700">
            {formatTimestamp(Math.floor(lastUpdated / 1000))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Balance Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">PUSD Balance</span>
              <span className="text-xl font-bold text-slate-900">
                {formatUsd(balance.pusdBalance)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">SOL Balance</span>
              <span className="text-lg font-semibold text-slate-700">
                {balance.solBalance.toFixed(4)} SOL
              </span>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Received</span>
                <span className="font-semibold text-emerald-600">
                  {formatUsd(metrics.totalReceived)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-500">Total Sent</span>
                <span className="font-semibold text-red-600">
                  {formatUsd(metrics.totalSent)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Trust Score</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Live</span>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <TrustScoreBadge
              score={trustScore.score}
              label={trustScore.label}
              size="lg"
            />
          </div>
          <div className="space-y-3">
            <TrustScoreBar score={trustScore.factors.volumeScore} label="Volume Score" />
            <TrustScoreBar score={trustScore.factors.counterpartiesScore} label="Counterparties" />
            <TrustScoreBar score={trustScore.factors.activityScore} label="Activity" />
            <TrustScoreBar score={trustScore.factors.stabilityScore} label="Stability" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Activity Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total Transactions</span>
              <span className="font-semibold text-slate-900">
                {formatCompactNumber(metrics.transactionCount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Unique Counterparties</span>
              <span className="font-semibold text-slate-900">
                {metrics.uniqueCounterparties}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Avg Transaction Size</span>
              <span className="font-semibold text-slate-900">
                {formatUsd(metrics.avgTransactionSize)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Account Age</span>
              <span className="font-semibold text-slate-900">
                {accountAge} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">First Activity</span>
              <span className="font-semibold text-slate-900">
                {formatTimestamp(metrics.firstActivity)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Transaction Timeline</h2>
        </div>
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-auto">
          {recentTransactions.map((tx, index) => (
            <div
              key={`${tx.signature}-${index}`}
              className="p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span
                    className={clsx(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold",
                      tx.type === "receive"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {tx.type === "receive" ? "IN" : "OUT"}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">
                        {tx.type === "receive" ? "From" : "To"}
                      </span>
                      <Link
                        href={`/wallet/${
                          tx.type === "receive" ? tx.fromAddress : tx.toAddress
                        }`}
                        className="font-mono text-sm text-cyan-600 hover:underline"
                      >
                        {formatAddress(
                          tx.type === "receive" ? tx.fromAddress : tx.toAddress,
                          6
                        )}
                      </Link>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      {tx.signature}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.type === "receive" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "receive" ? "+" : "-"}
                    {formatUsd(tx.amount)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatTimestamp(tx.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}