"use client";

import { formatUsd } from "@/lib/formatters";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: string;
  color?: "default" | "cyan" | "emerald" | "amber" | "red";
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = "default",
}: StatCardProps) {
  const colorClasses = {
    default: "bg-slate-50",
    cyan: "bg-cyan-50",
    emerald: "bg-emerald-50",
    amber: "bg-amber-50",
    red: "bg-red-50",
  };

  const iconColorClasses = {
    default: "text-slate-400",
    cyan: "text-cyan-500",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    red: "text-red-500",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p
              className={`text-sm font-medium mt-1 ${
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <span className={`text-2xl ${iconColorClasses[color]}`}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface OverviewStatsProps {
  totalVolume: number;
  activeWallets: number;
  avgTransactionSize: number;
  totalTransactions: number;
}

export function OverviewStats({
  totalVolume,
  activeWallets,
  avgTransactionSize,
  totalTransactions,
}: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total PUSD Volume"
        value={formatUsd(totalVolume)}
        subtitle="All time"
        icon="💰"
        color="cyan"
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatCard
        title="Active Wallets"
        value={formatUsd(activeWallets)}
        subtitle="Last 24h"
        icon="👛"
        color="emerald"
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatCard
        title="Avg Transaction Size"
        value={formatUsd(avgTransactionSize)}
        subtitle="Per transaction"
        icon="📊"
        color="amber"
        trend={{ value: 3.1, isPositive: false }}
      />
      <StatCard
        title="Total Transactions"
        value={formatUsd(totalTransactions)}
        subtitle="All time"
        icon="🔄"
        color="default"
        trend={{ value: 15.7, isPositive: true }}
      />
    </div>
  );
}