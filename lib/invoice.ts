import {
  encryptInvoiceData,
  decryptInvoiceData,
  generateViewingKey,
  generateInvoiceId,
  generateShareableLink,
} from "./encryption";

export interface Invoice {
  id: string;
  amount: string;
  description: string;
  sender: string;
  recipient: string;
  createdAt: string;
  status: "pending" | "paid" | "expired";
  viewingKey: string;
  encryptedData: string;
}

export interface InvoiceLink {
  id: string;
  url: string;
  viewingKey: string;
}

const invoices = new Map<string, Invoice>();
const invoiceLinks = new Map<string, string>();

export function createInvoice(
  amount: string,
  description: string,
  sender: string,
  recipient: string
): InvoiceLink {
  const id = generateInvoiceId();
  const viewingKey = generateViewingKey();
  const createdAt = new Date().toISOString();

  const invoiceData = {
    amount,
    description,
    sender,
    recipient,
    createdAt,
  };

  const encryptedData = encryptInvoiceData(invoiceData, viewingKey);

  const invoice: Invoice = {
    id,
    amount,
    description,
    sender,
    recipient,
    createdAt,
    status: "pending",
    viewingKey,
    encryptedData,
  };

  invoices.set(id, invoice);
  invoiceLinks.set(id, viewingKey);

  const url = generateShareableLink(id, viewingKey);

  return {
    id,
    url,
    viewingKey,
  };
}

export function getInvoice(id: string): Invoice | null {
  return invoices.get(id) || null;
}

export function getInvoiceByIdAndKey(id: string, viewingKey: string): Invoice | null {
  const invoice = invoices.get(id);
  
  if (!invoice) return null;
  if (invoice.viewingKey !== viewingKey) return null;
  
  return invoice;
}

export function decryptInvoice(id: string, viewingKey: string): {
  amount: string;
  description: string;
  sender: string;
  recipient: string;
  createdAt: string;
} | null {
  const invoice = invoices.get(id);
  
  if (!invoice) return null;
  if (invoice.viewingKey !== viewingKey) return null;
  
  return decryptInvoiceData(invoice.encryptedData, viewingKey);
}

export function markInvoiceAsPaid(id: string): boolean {
  const invoice = invoices.get(id);
  
  if (!invoice) return false;
  
  invoice.status = "paid";
  return true;
}

export function getAllInvoices(): Invoice[] {
  return Array.from(invoices.values());
}

export function getInvoicesBySender(sender: string): Invoice[] {
  return Array.from(invoices.values()).filter(
    (invoice) => invoice.sender === sender
  );
}

export function getInvoicesByRecipient(recipient: string): Invoice[] {
  return Array.from(invoices.values()).filter(
    (invoice) => invoice.recipient === recipient
  );
}

export function getInvoicesSent(address: string): Invoice[] {
  return getInvoicesBySender(address);
}

export function getInvoicesReceived(address: string): Invoice[] {
  return getInvoicesByRecipient(address);
}

export function deleteInvoice(id: string): boolean {
  const invoice = invoices.get(id);
  
  if (!invoice) return false;
  
  invoices.delete(id);
  invoiceLinks.delete(id);
  return true;
}