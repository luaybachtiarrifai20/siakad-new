import { Router } from "express";
import bcrypt from "bcryptjs";
import { generateOTP, sendOTP } from "../utils/otp";
import { setOtp, getOtp, deleteOtp } from "../utils/otpStore";
import prisma from "../utils/prisma";
import admin from "../config/firebase";

const router = Router();

router.post("/request-otp", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email dan password wajib diisi" });
    return;
  }

  // Validate user exists in DB
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) {
    res.status(401).json({ error: "Email tidak terdaftar" });
    return;
  }

  // Validate password (if set) — allow bypass for users without password yet
  if (dbUser.password) {
    const match = await bcrypt.compare(password, dbUser.password);
    if (!match) {
      res.status(401).json({ error: "Password salah" });
      return;
    }
  }

  const otp = generateOTP();
  setOtp(email, otp);

  try {
    await sendOTP(email, otp);
    res.json({ message: "OTP berhasil dikirim ke email Anda" });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengirim OTP" });
  }
});

router.post("/verify-otp", async (req, res): Promise<void> => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ error: "Email and OTP are required" });
    return;
  }

  const storedData = getOtp(email);
  if (!storedData) {
    res.status(400).json({ error: "No OTP requested for this email" });
    return;
  }

  if (storedData.expiresAt < Date.now()) {
    deleteOtp(email);
    res.status(400).json({ error: "OTP has expired" });
    return;
  }

  if (storedData.otp !== otp) {
    res.status(400).json({ error: "Invalid OTP" });
    return;
  }

  try {
    let user;
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_PROJECT_ID !== "your-project-id"
    ) {
      try {
        user = await admin.auth().getUserByEmail(email);
      } catch (err: any) {
        if (err.code === "auth/user-not-found") {
          user = await admin.auth().createUser({ email });
        } else {
          throw err;
        }
      }
    } else {
      // MOCK MODE BYPASS
      user = { uid: `mock-uid-${email}`, email };
      console.log(`[Database Mock] Bypassed Firebase API for: ${email}`);
    }

    // Generates Firebase Custom Token to be consumed by the React app
    let customToken = "mock_custom_token_bypass";
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_PROJECT_ID !== "your-project-id"
    ) {
      customToken = await admin.auth().createCustomToken(user.uid);
    }

    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });
    if (dbUser) {
      // Link the pre-seeded local dbUser with the real Firebase UID generated upon OTP login
      if (dbUser.firebaseUid !== user.uid) {
        dbUser = await prisma.user.update({
          where: { email: user.email! },
          data: { firebaseUid: user.uid },
        });
      }
    } else {
      dbUser = await prisma.user.create({
        data: {
          firebaseUid: user.uid,
          email: user.email!,
          name: email.split("@")[0],
        },
      });
    }

    deleteOtp(email);
    res.json({ customToken, role: dbUser.role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to verify OTP and issue token" });
  }
});

export default router;
