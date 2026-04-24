import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Invoice {
  id: string;
  amount: string;
  description: string;
  sender: string;
  recipient: string;
  createdAt: string;
  status: "pending" | "paid" | "expired";
}

interface AppState {
  wallet: string | null;
  encryptedBalance: string | null;
  viewingKeys: Record<string, string>;
  invoicesSent: Invoice[];
  invoicesReceived: Invoice[];
  isRegistered: boolean;
  isConnected: boolean;
  
  setWallet: (wallet: string | null) => void;
  setEncryptedBalance: (balance: string | null) => void;
  addViewingKey: (invoiceId: string, key: string) => void;
  removeViewingKey: (invoiceId: string) => void;
  getViewingKey: (invoiceId: string) => string | undefined;
  addInvoice: (invoice: Invoice, direction: "sent" | "received") => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;
  setIsRegistered: (registered: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      wallet: null,
      encryptedBalance: null,
      viewingKeys: {},
      invoicesSent: [],
      invoicesReceived: [],
      isRegistered: false,
      isConnected: false,

      setWallet: (wallet) => set({ wallet }),

      setEncryptedBalance: (balance) => set({ encryptedBalance: balance }),

      addViewingKey: (invoiceId, key) =>
        set((state) => ({
          viewingKeys: { ...state.viewingKeys, [invoiceId]: key },
        })),

      removeViewingKey: (invoiceId) =>
        set((state) => {
          const keys = { ...state.viewingKeys };
          delete keys[invoiceId];
          return { viewingKeys: keys };
        }),

      getViewingKey: (invoiceId) => get().viewingKeys[invoiceId],

      addInvoice: (invoice, direction) =>
        set((state) => {
          if (direction === "sent") {
            return { invoicesSent: [...state.invoicesSent, invoice] };
          } else {
            return { invoicesReceived: [...state.invoicesReceived, invoice] };
          }
        }),

      updateInvoiceStatus: (id, status) =>
        set((state) => ({
          invoicesSent: state.invoicesSent.map((inv) =>
            inv.id === id ? { ...inv, status } : inv
          ),
          invoicesReceived: state.invoicesReceived.map((inv) =>
            inv.id === id ? { ...inv, status } : inv
          ),
        })),

      setIsRegistered: (registered) => set({ isRegistered: registered }),

      setIsConnected: (connected) => set({ isConnected: connected }),

      reset: () =>
        set({
          wallet: null,
          encryptedBalance: null,
          viewingKeys: {},
          invoicesSent: [],
          invoicesReceived: [],
          isRegistered: false,
          isConnected: false,
        }),
    }),
    {
      name: "shadowinvoice-storage",
      partialize: (state) => ({
        wallet: state.wallet,
        viewingKeys: state.viewingKeys,
        invoicesSent: state.invoicesSent,
        invoicesReceived: state.invoicesReceived,
      }),
    }
  )
);