import { OverviewStats } from "@/components/StatCard";
import { FlowGraph, ActivityHeatmap } from "@/components/FlowGraph";
import { TransactionFeed } from "@/components/TransactionFeed";
import { WalletCard } from "@/components/WalletCard";
import { simClient } from "@/lib/simClient";
import { formatUsd, formatCompactNumber } from "@/lib/formatters";

export const dynamic = "force-dynamic";

async function getAnalyticsData() {
  const mockAddresses = simClient.getMockWalletAddresses();
  const wallets = await Promise.all(
    mockAddresses.map((addr) => simClient.getFullWalletData(addr))
  );

  const allTransactions = wallets.flatMap((w) => w.transactions);
  const totalVolume = wallets.reduce(
    (sum, w) => sum + w.metrics.totalReceived + w.metrics.totalSent,
    0
  );
  const activeWallets = wallets.filter(
    (w) => Date.now() / 1000 - w.metrics.lastActivity < 86400
  ).length;
  const avgTransactionSize =
    allTransactions.length > 0
      ? totalVolume / allTransactions.length
      : 0;

  const topWallets = [...wallets].sort(
    (a, b) => b.metrics.totalReceived + b.metrics.totalSent - (a.metrics.totalReceived + a.metrics.totalSent)
  );

  return {
    totalVolume,
    activeWallets,
    avgTransactionSize,
    totalTransactions: allTransactions.length,
    topWallets,
    allTransactions,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Economic Overview</h1>
        <p className="text-slate-500 mt-1">
          Network-wide PUSD metrics and activity analysis
        </p>
      </div>

      <OverviewStats
        totalVolume={data.totalVolume}
        activeWallets={data.activeWallets}
        avgTransactionSize={data.avgTransactionSize}
        totalTransactions={data.totalTransactions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlowGraph transactions={data.allTransactions} title="Volume Over Time" />
        <ActivityHeatmap transactions={data.allTransactions} title="Activity Heatmap" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Top Wallets by Volume</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.topWallets.map((wallet) => (
            <WalletCard key={wallet.balance.address} data={wallet} />
          ))}
        </div>
      </div>

      <TransactionFeed
        transactions={data.allTransactions.slice(0, 50)}
        title="Recent Network Activity"
        maxHeight="max-h-[400px]"
        showFilters={false}
      />
    </div>
  );
}