"use client";

import { PrivateBalance } from "@/components/PrivateBalance";
import { useAppStore } from "@/lib/store";

export default function DashboardPage() {
  const isConnected = useAppStore((state) => state.isConnected);
  const wallet = useAppStore((state) => state.wallet);
  const invoicesSent = useAppStore((state) => state.invoicesSent);
  const invoicesReceived = useAppStore((state) => state.invoicesReceived);
  const encryptedBalance = useAppStore((state) => state.encryptedBalance);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">◉</div>
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-slate-400">
            Connect to view your private invoices and encrypted balance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">
          Private invoice management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PrivateBalance balance={encryptedBalance} />

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a
              href="/create"
              className="block w-full bg-violet-600 hover:bg-violet-500 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
            >
              + Create Invoice
            </a>
            <a
              href="/compliance"
              className="block w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Verify Transaction
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Invoices Sent</h3>
            <span className="text-sm text-slate-500">{invoicesSent.length}</span>
          </div>
          
          {invoicesSent.length === 0 ? (
            <p className="text-slate-500 text-sm">No invoices sent yet</p>
          ) : (
            <div className="space-y-3">
              {invoicesSent.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0"
                >
                  <div>
                    <div className="text-white text-sm font-medium">
                      {invoice.amount} PUSD
                    </div>
                    <div className="text-slate-500 text-xs">
                      {invoice.description.slice(0, 30)}...
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      invoice.status === "paid"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Invoices Received</h3>
            <span className="text-sm text-slate-500">{invoicesReceived.length}</span>
          </div>
          
          {invoicesReceived.length === 0 ? (
            <p className="text-slate-500 text-sm">No invoices received yet</p>
          ) : (
            <div className="space-y-3">
              {invoicesReceived.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0"
                >
                  <div>
                    <div className="text-white text-sm font-medium">
                      {invoice.amount} PUSD
                    </div>
                    <div className="text-slate-500 text-xs">
                      {invoice.description.slice(0, 30)}...
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      invoice.status === "paid"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}