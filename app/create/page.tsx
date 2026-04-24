"use client";

import { InvoiceForm } from "@/components/InvoiceForm";

export default function CreatePage() {
  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Invoice</h1>
        <p className="text-slate-400">
          Generate a private invoice link. Data is encrypted client-side.
        </p>
      </div>

      <InvoiceForm />
    </div>
  );
}