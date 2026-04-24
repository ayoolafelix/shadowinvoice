"use client";

import { useState } from "react";
import { createInvoice, type InvoiceLink } from "@/lib/invoice";
import { useAppStore } from "@/lib/store";
import { parseAmount } from "@/lib/umbraClient";

interface InvoiceFormProps {
  onSuccess?: (link: InvoiceLink, amount: string, description: string) => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<InvoiceLink | null>(null);

  const wallet = useAppStore((state) => state.wallet);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }

    if (!wallet) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);

    try {
      const amountBigInt = parseAmount(amount);
      const link = createInvoice(
        amount,
        description,
        wallet,
        wallet
      );

      setSuccess(link);
      
      useAppStore.getState().addInvoice(
        {
          id: link.id,
          amount,
          description,
          sender: wallet,
          recipient: wallet,
          createdAt: new Date().toISOString(),
          status: "pending",
        },
        "sent"
      );

      if (onSuccess) {
        onSuccess(link, amount, description);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (success) {
      navigator.clipboard.writeText(success.url);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Create Invoice</h2>
      
      {!wallet ? (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">Connect your wallet to create invoices</p>
        </div>
      ) : success ? (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-emerald-400">
            Invoice created successfully
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Invoice Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={success.url}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 text-sm"
              />
              <button
                onClick={copyLink}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Viewing Key (save securely)
            </label>
            <input
              type="text"
              readOnly
              value={success.viewingKey}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 text-sm font-mono"
            />
          </div>

          <button
            onClick={() => setSuccess(null)}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Create Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Amount (PUSD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this payment for?"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </form>
      )}
    </div>
  );
}