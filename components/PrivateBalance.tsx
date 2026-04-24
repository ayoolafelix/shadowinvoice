"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";

interface PrivateBalanceProps {
  balance?: string | null;
}

export function PrivateBalance({ balance }: PrivateBalanceProps) {
  const [showBalance, setShowBalance] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const wallet = useAppStore((state) => state.wallet);

  const displayBalance = balance || "—";

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Private Balance
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-slate-500">Umbra Shielded</span>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="text-3xl font-bold text-white tracking-tight"
        >
          {showBalance ? `${displayBalance} PUSD` : "•••••• PUSD"}
        </button>
      </div>

      {wallet && (
        <div className="flex items-center justify-between text-sm">
          <button
            onClick={copyAddress}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="font-mono">
              {wallet.slice(0, 4)}...{wallet.slice(-4)}
            </span>
            <span className="text-slate-600">
              {copied ? "✓" : "Copy"}
            </span>
          </button>
          
          <span className="text-slate-500 text-xs">
            {showBalance ? "Click to hide" : "Click to reveal"}
          </span>
        </div>
      )}
    </div>
  );
}