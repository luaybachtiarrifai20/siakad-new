import { OtpStore } from "./database";

interface OtpEntry {
  otp: string;
  expiresAt: number;
  createdAt: number;
  requestId: string;
}

export async function setOtp(email: string, otp: string): Promise<string> {
  const normalizedEmail = email.toLowerCase().trim();
  const requestId =
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const data: OtpEntry = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiration
    createdAt: Date.now(),
    requestId,
  };

  await OtpStore.upsert(normalizedEmail, data);
  return requestId;
}

export async function getOtp(email: string): Promise<OtpEntry | undefined> {
  const normalizedEmail = email.toLowerCase().trim();
  const otpEntry = await OtpStore.findByEmail(normalizedEmail);

  console.log(
    `[DEBUG] Getting OTP for ${normalizedEmail}:`,
    otpEntry
      ? {
          otp: otpEntry.otp,
          expiresAt: new Date(Number(otpEntry.expiresAt)).toISOString(),
          createdAt: new Date(Number(otpEntry.createdAt)).toISOString(),
          requestId: otpEntry.requestId,
          isExpired: Number(otpEntry.expiresAt) <= Date.now(),
        }
      : "NOT_FOUND",
  );

  // Check if OTP exists and is not expired
  if (otpEntry && Number(otpEntry.expiresAt) > Date.now()) {
    return {
      ...otpEntry,
      expiresAt: Number(otpEntry.expiresAt),
      createdAt: Number(otpEntry.createdAt),
    };
  }

  // If expired, delete it and return undefined
  if (otpEntry) {
    console.log(`[DEBUG] OTP expired for ${normalizedEmail}, deleting...`);
    await OtpStore.delete(normalizedEmail);
  }

  return undefined;
}

export async function deleteOtp(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  await OtpStore.delete(normalizedEmail);
}

// Clean up expired OTPs (Optional, can be called by a cron job)
export async function cleanupExpiredOtps(): Promise<void> {
  // Logic to delete expired rows from database
  // NOT implemented here for simplicity, but could be:
  // await db.query("DELETE FROM OtpStore WHERE expiresAt <= ?", [Date.now()]);
}

// Get OTP info for debugging
export async function getOtpInfo(email: string): Promise<any | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const otpEntry = await OtpStore.findByEmail(normalizedEmail);

  if (!otpEntry) {
    return null;
  }

  const expiresAt = Number(otpEntry.expiresAt);
  return {
    ...otpEntry,
    expiresAt,
    createdAt: Number(otpEntry.createdAt),
    isExpired: expiresAt <= Date.now(),
    timeRemaining: Math.max(0, expiresAt - Date.now()),
  };
}
