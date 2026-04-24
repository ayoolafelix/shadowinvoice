"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PaymentCard } from "@/components/PaymentCard";
import { getInvoice, decryptInvoice, markInvoiceAsPaid, type Invoice } from "@/lib/invoice";

export default function PayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [decryptedData, setDecryptedData] = useState<{
    amount: string;
    description: string;
    sender: string;
    recipient: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const invoiceId = params.id as string;
  const viewingKey = searchParams.get("key");

  useEffect(() => {
    if (!invoiceId || !viewingKey) {
      setError("Invalid invoice link");
      setLoading(false);
      return;
    }

    const inv = getInvoice(invoiceId);
    if (!inv) {
      setError("Invoice not found");
      setLoading(false);
      return;
    }

    setInvoice(inv);

    const data = decryptInvoice(invoiceId, viewingKey);
    if (!data) {
      setError("Invalid viewing key");
      setLoading(false);
      return;
    }

    setDecryptedData(data);
    setLoading(false);
  }, [invoiceId, viewingKey]);

  const handlePay = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    markInvoiceAsPaid(id);
  };

  if (loading) {
    <div className="max-w-lg mx-auto py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-800 rounded w-1/3"></div>
        <div className="h-64 bg-slate-800 rounded"></div>
      </div>
    </div>;
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">✗</div>
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!invoice || !decryptedData) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pay Invoice</h1>
        <p className="text-slate-400">
          Payment is processed confidentially via Umbra
        </p>
      </div>

      <PaymentCard
        invoiceId={invoice.id}
        amount={decryptedData.amount}
        description={decryptedData.description}
        recipient={decryptedData.recipient}
        onPay={handlePay}
      />
    </div>
  );
}