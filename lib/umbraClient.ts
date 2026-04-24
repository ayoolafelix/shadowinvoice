declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect(): Promise<{ publicKey: { toBase58(): string } }>;
        disconnect(): Promise<void>;
        signMessage(message: Uint8Array, display?: string): Promise<{ signature: Uint8Array }>;
        signTransaction(transaction: any): Promise<any>;
        on(event: string, callback: (args: any) => void): void;
      };
    };
  }
}

export interface UmbraClient {
  signer: {
    address: string;
  };
}

export interface UmbraSigner {
  address: string;
}

const PUSD_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com";
const RPC_SUBSCRIPTIONS_URL = process.env.NEXT_PUBLIC_RPC_SUBSCRIPTIONS_URL || "wss://api.mainnet-beta.solana.com";
const INDEXER_API_ENDPOINT = process.env.NEXT_PUBLIC_INDEXER_API_ENDPOINT || "https://utxo-indexer.api.umbraprivacy.com";

let clientInstance: UmbraClient | null = null;

export async function initUmbraClient(signer: UmbraSigner): Promise<UmbraClient> {
  return {
    signer,
    network: "mainnet",
  } as any;
}

export async function getClient(): Promise<UmbraClient | null> {
  return clientInstance;
}

export async function registerUser(_client: UmbraClient): Promise<void> {
  console.log("Registering user with Umbra...");
}

export async function shieldFunds(
  client: UmbraClient,
  amount: bigint
): Promise<{ signature: string; encryptedBalance: bigint }> {
  console.log(`Shielding ${amount} PUSD for ${client.signer.address}`);
  return {
    signature: "mock_signature_" + Date.now(),
    encryptedBalance: amount,
  };
}

export async function unshieldFunds(
  client: UmbraClient,
  amount: bigint
): Promise<string> {
  console.log(`Unshielding ${amount} PUSD for ${client.signer.address}`);
  return "mock_signature_" + Date.now();
}

export async function createPrivatePayment(
  client: UmbraClient,
  recipientAddress: string,
  amount: bigint
): Promise<{ signature: string; utxoId: string }> {
  console.log(`Creating private payment of ${amount} PUSD to ${recipientAddress}`);
  return {
    signature: "mock_signature_" + Date.now(),
    utxoId: "mock_utxo_" + Math.random().toString(36).slice(2),
  };
}

export async function scanForPayments(
  _client: UmbraClient
): Promise<{ amount: bigint; sender: string; memo?: string }[]> {
  return [];
}

export async function claimPayment(
  _client: UmbraClient,
  utxoId: string
): Promise<string> {
  console.log(`Claiming UTXO: ${utxoId}`);
  return "mock_signature_" + Date.now();
}

export async function getUserAccount(
  _client: UmbraClient,
  _address: string
): Promise<{ registered: boolean; hasEncryptedBalance: boolean }> {
  return {
    registered: true,
    hasEncryptedBalance: true,
  };
}

export async function getEncryptedBalance(
  _client: UmbraClient,
  _address: string
): Promise<bigint> {
  return 0n;
}

export function getPusdMint(): string {
  return PUSD_MINT;
}

export function formatAmount(amount: bigint, decimals: number = 6): string {
  const amountStr = amount.toString();
  const padded = amountStr.padStart(decimals + 1, "0");
  const integerPart = padded.slice(0, -decimals);
  const fractionalPart = padded.slice(-decimals).replace(/\.?0+$/, "");
  return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
}

export function parseAmount(amountStr: string, decimals: number = 6): bigint {
  const [integer, fractional = ""] = amountStr.split(".");
  const padded = (integer + fractional).padEnd(decimals + integer.length, "0").slice(0, decimals + integer.length);
  return BigInt(padded);
}