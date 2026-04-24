"use client";

import Link from "next/link";
import { WalletButton } from "@/components/WalletButton";
import { useAppStore } from "@/lib/store";

export default function HomePage() {
  const isConnected = useAppStore((state) => state.isConnected);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-white mb-6">
          Shadow<span className="text-violet-400">Invoice</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-8">
          Private invoicing & payments on Solana. Your financial data is encrypted end-to-end.
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <Link
            href="/dashboard"
            className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Open Dashboard
          </Link>
          
          {!isConnected && <WalletButton />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold text-white mb-2">Encrypted Data</h3>
            <p className="text-slate-400 text-sm">
              Invoice amounts and descriptions are encrypted client-side. Never stored in plaintext.
            </p>
          </div>
          
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
            <div className="text-3xl mb-3">⬡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Umbra Shielded</h3>
            <p className="text-slate-400 text-sm">
              Payments go through Umbra&apos;s confidential transfer protocol. Balances stay private.
            </p>
          </div>
          
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
            <div className="text-3xl mb-3">🔑</div>
            <h3 className="text-lg font-semibold text-white mb-2">Viewing Keys</h3>
            <p className="text-slate-400 text-sm">
              Generate per-transaction viewing keys for selective disclosure to auditors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}