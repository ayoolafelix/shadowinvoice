import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, KEY_LENGTH);
}

export function generateViewingKey(): string {
  return randomBytes(32).toString("base64");
}

export function encryptInvoiceData(
  data: {
    amount: string;
    description: string;
    sender: string;
    recipient: string;
    createdAt: string;
  },
  viewingKey: string
): string {
  const salt = randomBytes(SALT_LENGTH);
  const key = deriveKey(viewingKey, salt);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  const jsonData = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(jsonData, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  const result = Buffer.concat([salt, iv, authTag, encrypted]);
  return result.toString("base64");
}

export function decryptInvoiceData(
  encryptedData: string,
  viewingKey: string
): {
  amount: string;
  description: string;
  sender: string;
  recipient: string;
  createdAt: string;
} | null {
  try {
    const buffer = Buffer.from(encryptedData, "base64");
    
    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

    const key = deriveKey(viewingKey, salt);
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString("utf8"));
  } catch {
    return null;
  }
}

export function encryptAmount(amount: string, viewingKey: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const key = deriveKey(viewingKey, salt);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(amount, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  const result = Buffer.concat([salt, iv, authTag, encrypted]);
  return result.toString("base64");
}

export function decryptAmount(encryptedAmount: string, viewingKey: string): string | null {
  try {
    const buffer = Buffer.from(encryptedAmount, "base64");
    
    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

    const key = deriveKey(viewingKey, salt);
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}

export function generateInvoiceId(): string {
  return randomBytes(16).toString("hex");
}

export function generateShareableLink(invoiceId: string, viewingKey: string): string {
  const params = new URLSearchParams({
    id: invoiceId,
    key: viewingKey,
  });
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pay?${params.toString()}`;
}