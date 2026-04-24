"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function WalletButton() {
  const [connecting, setConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const wallet = useAppStore((state) => state.wallet);
  const setWallet = useAppStore((state) => state.setWallet);
  const isConnected = useAppStore((state) => state.isConnected);
  const setIsConnected = useAppStore((state) => state.setIsConnected);

  const mockConnect = async () => {
    setConnecting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockWallet = "7xKXtg2CW87d97TXJSDpbD5eBk8Kzkj3LnqGruqHFfDu" + Math.random().toString(36).slice(2, 6);
    setWallet(mockWallet);
    setIsConnected(true);
    setConnecting(false);
    setShowDropdown(false);
  };

  const disconnect = () => {
    setWallet(null);
    setIsConnected(false);
    useAppStore.getState().reset();
    setShowDropdown(false);
  };

  if (isConnected && wallet) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          <span className="font-mono">
            {wallet.slice(0, 4)}...{wallet.slice(-4)}
          </span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
            <button
              onClick={disconnect}
              className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={connecting}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
      >
        <span className="text-slate-400">{connecting ? "Connecting..." : "Connect Wallet"}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={mockConnect}
            className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700 transition-colors text-sm flex items-center gap-3"
          >
            <span className="text-xl">Phantom</span>
            Phantom
          </button>
          <button
            onClick={mockConnect}
            className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700 transition-colors text-sm flex items-center gap-3"
          >
            <span className="text-xl">Solflare</span>
            Solflare
          </button>
        </div>
      )}
    </div>
  );
}