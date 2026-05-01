import * as fs from "fs";
import * as path from "path";

const STORE_FILE = path.join(process.cwd(), ".otp_store.json");

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

function readStore(): Record<string, OtpEntry> {
  try {
    if (fs.existsSync(STORE_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
    }
  } catch {
    /* ignore */
  }
  return {};
}

function writeStore(store: Record<string, OtpEntry>): void {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
}

export function setOtp(email: string, otp: string): void {
  const store = readStore();
  store[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
  writeStore(store);
}

export function getOtp(email: string): OtpEntry | undefined {
  const store = readStore();
  return store[email];
}

export function deleteOtp(email: string): void {
  const store = readStore();
  delete store[email];
  writeStore(store);
}
