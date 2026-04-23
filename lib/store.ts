import { create } from "zustand";
import { Transaction, DuneWalletData } from "./simClient";

interface WalletState {
  selectedWallet: string | null;
  setSelectedWallet: (address: string | null) => void;
  walletCache: Record<string, DuneWalletData>;
  setWalletData: (address: string, data: DuneWalletData) => void;
  getWalletData: (address: string) => DuneWalletData | undefined;
}

interface LiveTransactionState {
  liveTransactions: Transaction[];
  addTransactions: (transactions: Transaction[]) => void;
  clearTransactions: () => void;
}

interface TrustScoreState {
  trustScores: Record<string, number>;
  setTrustScore: (address: string, score: number) => void;
  getTrustScore: (address: string) => number | undefined;
}

interface FilterState {
  incomingFilter: boolean;
  outgoingFilter: boolean;
  setIncomingFilter: (value: boolean) => void;
  setOutgoingFilter: (value: boolean) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  selectedWallet: null,
  setSelectedWallet: (address) => set({ selectedWallet: address }),
  walletCache: {},
  setWalletData: (address, data) =>
    set((state) => ({
      walletCache: { ...state.walletCache, [address]: data },
    })),
  getWalletData: (address) => get().walletCache[address],
}));

export const useLiveTransactionStore = create<LiveTransactionState>((set) => ({
  liveTransactions: [],
  addTransactions: (transactions) =>
    set((state) => ({
      liveTransactions: [...transactions, ...state.liveTransactions].slice(0, 500),
    })),
  clearTransactions: () => set({ liveTransactions: [] }),
}));

export const useTrustScoreStore = create<TrustScoreState>((set, get) => ({
  trustScores: {},
  setTrustScore: (address, score) =>
    set((state) => ({
      trustScores: { ...state.trustScores, [address]: score },
    })),
  getTrustScore: (address) => get().trustScores[address],
}));

export const useFilterStore = create<FilterState>((set) => ({
  incomingFilter: true,
  outgoingFilter: true,
  setIncomingFilter: (value) => set({ incomingFilter: value }),
  setOutgoingFilter: (value) => set({ outgoingFilter: value }),
}));