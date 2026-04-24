"use client";

import { useState } from "react";

interface ViewingKeyPanelProps {
  onVerify: (signature: string, viewingKey: string) => Promise<{
    amount: string;
    sender: string;
    receiver: string;
  } | null>;
}

export function ViewingKeyPanel({ onVerify }: ViewingKeyPanelProps) {
  const [signature, setSignature] = useState("");
  const [viewingKey, setViewingKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    amount: string;
    sender: string;
    receiver: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await onVerify(signature, viewingKey);
      if (data) {
        setResult(data);
      } else {
        setError("Invalid signature or viewing key");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">View Transaction</h3>

      {result ? (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <div className="text-emerald-400 text-sm mb-2">Decryption Successful</div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount</span>
                <span className="text-white font-medium">{result.amount} PUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sender</span>
                <span className="text-white font-mono text-sm">
                  {result.sender.slice(0, 4)}...{result.sender.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Receiver</span>
                <span className="text-white font-mono text-sm">
                  {result.receiver.slice(0, 4)}...{result.receiver.slice(-4)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Verify Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Transaction Signature
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Enter transaction signature"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Viewing Key
            </label>
            <input
              type="text"
              value={viewingKey}
              onChange={(e) => setViewingKey(e.target.value)}
              placeholder="Enter viewing key"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !signature || !viewingKey}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? "Decrypting..." : "Decrypt Transaction"}
          </button>
        </form>
      )}
    </div>
  );
}