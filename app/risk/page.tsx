import { RiskPanel } from "@/components/RiskPanel";
import { simClient } from "@/lib/simClient";

interface RiskWallet {
  address: string;
  riskType: "high_velocity" | "low_trust" | "new_volume";
  riskScore: number;
  volume24h: number;
  txnCount24h: number;
  label: string;
}

export const dynamic = "force-dynamic";

async function getRiskWallets(): Promise<RiskWallet[]> {
  const mockAddresses = simClient.getMockWalletAddresses();
  const wallets = await Promise.all(
    mockAddresses.map((addr) => simClient.getFullWalletData(addr))
  );

  return wallets.map((wallet) => {
    const volume24h = wallet.transactions
      .filter((tx) => Date.now() / 1000 - tx.timestamp < 86400)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const txnCount24h = wallet.transactions.filter(
      (tx) => Date.now() / 1000 - tx.timestamp < 86400
    ).length;

    let riskType: "high_velocity" | "low_trust" | "new_volume" = "low_trust";
    let riskScore = 50;
    let label = "Monitor";

    if (txnCount24h > 50 || volume24h > 50000) {
      riskType = "high_velocity";
      riskScore = 75;
      label = "High Velocity";
    } else if (volume24h > 10000 && txnCount24h < 5) {
      riskType = "new_volume";
      riskScore = 65;
      label = "New High Volume";
    } else if (wallet.metrics.transactionCount < 10) {
      riskType = "low_trust";
      riskScore = 30;
      label = "Low Trust Score";
    }

    return {
      address: wallet.balance.address,
      riskType,
      riskScore,
      volume24h,
      txnCount24h,
      label,
    };
  });
}

export default async function RiskPage() {
  const riskWallets = await getRiskWallets();

  const highRiskCount = riskWallets.filter((w) => w.riskScore >= 70).length;
  const mediumRiskCount = riskWallets.filter((w) => w.riskScore >= 40 && w.riskScore < 70).length;
  const lowRiskCount = riskWallets.filter((w) => w.riskScore < 40).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Risk Detection Panel</h1>
        <p className="text-slate-500 mt-1">
          Identify wallets with abnormal activity patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 text-sm font-medium">High Risk</p>
          <p className="text-3xl font-bold text-red-700 mt-2">{highRiskCount}</p>
          <p className="text-red-500 text-sm mt-1">wallets require attention</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-600 text-sm font-medium">Medium Risk</p>
          <p className="text-3xl font-bold text-amber-700 mt-2">{mediumRiskCount}</p>
          <p className="text-amber-500 text-sm mt-1">wallets under monitoring</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <p className="text-emerald-600 text-sm font-medium">Low Risk</p>
          <p className="text-3xl font-bold text-emerald-700 mt-2">{lowRiskCount}</p>
          <p className="text-emerald-500 text-sm mt-1">wallets in good standing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskPanel
          wallets={riskWallets.filter((w) => w.riskScore >= 70)}
          title="High Risk Alerts"
        />
        <RiskPanel
          wallets={riskWallets.filter((w) => w.riskScore >= 40 && w.riskScore < 70)}
          title="Medium Risk Alerts"
        />
      </div>

      <RiskPanel
        wallets={riskWallets.filter((w) => w.riskScore < 40)}
        title="Low Trust Wallets"
      />
    </div>
  );
}