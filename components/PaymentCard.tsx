"use client";

import { useState } from "react";

interface PaymentCardProps {
  invoiceId: string;
  amount: string;
  description: string;
  recipient: string;
  onPay: (invoiceId: string) => Promise<void>;
}

export function PaymentCard({
  invoiceId,
  amount,
  description,
  recipient,
  onPay,
}: PaymentCardProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "processing" | "success" | "error">("pending");
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setStatus("processing");
    setError(null);

    try {
      await onPay(invoiceId);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-white mb-2">Payment Complete</h3>
          <p className="text-slate-400">
            Your payment has been sent confidentially
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Payment</h2>
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          Via Umbra
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-3 border-b border-slate-800">
          <span className="text-slate-400">Amount</span>
          <span className="text-white font-semibold">{amount} PUSD</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-slate-800">
          <span className="text-slate-400">To</span>
          <span className="text-white font-mono text-sm">
            {recipient.slice(0, 4)}...{recipient.slice(-4)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 text-sm">Description</span>
          <p className="text-white mt-1">{description}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading || status === "processing"}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {status === "processing" ? (
          <>
            <span className="animate-spin">⟳</span>
            Processing...
          </>
        ) : (
          <>Pay {amount} PUSD</>
        )}
      </button>
    </div>
  );
}