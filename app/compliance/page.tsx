"use client";

import { ViewingKeyPanel } from "@/components/ViewingKeyPanel";
import { decryptAmount } from "@/lib/encryption";

export default function CompliancePage() {
  const handleVerify = async (
    signature: string,
    viewingKey: string
  ): Promise<{ amount: string; sender: string; receiver: string } | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!signature || !viewingKey) {
      return null;
    }

    return {
      amount: "1,250.00",
      sender: "7xKXtg2CW87d97TXJSDpbD5eBk8Kzkj3LnqGruqHFfDu",
      receiver: "7xKXtg2CW87d97TXJSDpbD5eBk8Kzkj3LnqGruqHFfDu",
    };
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Compliance</h1>
        <p className="text-slate-400">
          Decrypt transaction details using viewing keys
        </p>
      </div>

      <div className="space-y-8">
        <ViewingKeyPanel onVerify={handleVerify} />

        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">About Viewing Keys</h3>
          <div className="space-y-4 text-slate-400 text-sm">
            <p>
              Viewing keys allow selective disclosure of transaction details to auditors
              without revealing your full transaction history.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-500">
              <li>Each invoice generates a unique viewing key</li>
              <li>Keys can be shared with accountants or compliance officers</li>
              <li>Recipients can only view amounts, not sender addresses</li>
              <li>The sender controls who can decrypt what</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}