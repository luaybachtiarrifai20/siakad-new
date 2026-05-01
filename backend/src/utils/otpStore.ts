import * as fs from "fs";
import * as path from "path";

const STORE_FILE = path.join(process.cwd(), ".otp_store.json");

interface OtpEntry {
  otp: string;
  expiresAt: number;
  createdAt: number;
  requestId: string;
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

export function setOtp(email: string, otp: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  const store = readStore();
  const requestId =
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Delete any existing OTP for this email to prevent duplicates
  delete store[normalizedEmail];

  store[normalizedEmail] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiration
    createdAt: Date.now(),
    requestId,
  };
  writeStore(store);

  return requestId;
}

export function getOtp(email: string): OtpEntry | undefined {
  const normalizedEmail = email.toLowerCase().trim();
  const store = readStore();
  const otpEntry = store[normalizedEmail];

  console.log(
    `[DEBUG] Getting OTP for ${normalizedEmail}:`,
    otpEntry
      ? {
          otp: otpEntry.otp,
          expiresAt: new Date(otpEntry.expiresAt).toISOString(),
          createdAt: new Date(otpEntry.createdAt).toISOString(),
          requestId: otpEntry.requestId,
          isExpired: otpEntry.expiresAt <= Date.now(),
        }
      : "NOT_FOUND",
  );

  // Check if OTP exists and is not expired
  if (otpEntry && otpEntry.expiresAt > Date.now()) {
    return otpEntry;
  }

  // If expired, delete it and return undefined
  if (otpEntry) {
    console.log(`[DEBUG] OTP expired for ${normalizedEmail}, deleting...`);
    delete store[normalizedEmail];
    writeStore(store);
  }

  return undefined;
}

export function deleteOtp(email: string): void {
  const normalizedEmail = email.toLowerCase().trim();
  const store = readStore();
  delete store[normalizedEmail];
  writeStore(store);
}

// Clean up expired OTPs
export function cleanupExpiredOtps(): void {
  const store = readStore();
  const now = Date.now();
  let hasChanges = false;

  for (const email in store) {
    if (store[email].expiresAt <= now) {
      delete store[email];
      hasChanges = true;
    }
  }

  if (hasChanges) {
    writeStore(store);
  }
}

// Get OTP info for debugging
export function getOtpInfo(email: string): OtpEntry | null {
  const normalizedEmail = email.toLowerCase().trim();
  const store = readStore();
  const otpEntry = store[normalizedEmail];

  if (!otpEntry) {
    return null;
  }

  return {
    ...otpEntry,
    isExpired: otpEntry.expiresAt <= Date.now(),
    timeRemaining: Math.max(0, otpEntry.expiresAt - Date.now()),
  } as OtpEntry & { isExpired: boolean; timeRemaining: number };
}
