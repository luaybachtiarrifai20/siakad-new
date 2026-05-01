import express from "express";
import bcrypt from "bcryptjs";
import { db, User, Mahasiswa, Dosen } from "../utils/database";
import { generateOTP } from "../utils/otp";
import { sendOTP } from "../utils/otp";
import { setOtp, getOtp, deleteOtp } from "../utils/otpStore";
import admin from "../config/firebase";

const router = express.Router();

// Request OTP endpoint
router.post("/request-otp", async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail?.toLowerCase().trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password diperlukan" });
    }

    // Find user in database
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "User tidak ditemukan" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password salah" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP (returns requestId for tracking)
    const requestId = setOtp(email, otp);
    console.log(`OTP request ${requestId} created for ${email}`);

    // Send OTP via email
    try {
      await sendOTP(email, otp);
      console.log(`OTP berhasil dikirim ke ${email}`);
    } catch (emailError) {
      console.error("Gagal mengirim OTP:", emailError);
      return res.status(500).json({ error: "Gagal mengirim OTP" });
    }

    res.json({
      message: "OTP berhasil dikirim",
      email: email,
      // For development only - remove in production
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error: any) {
    console.error("Request OTP error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify OTP endpoint
router.post("/verify-otp", async (req, res) => {
  try {
    const { email: rawEmail, otp: rawOtp } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    const otp = rawOtp?.toString();

    if (!email || !otp) {
      return res.status(400).json({ error: "Email dan OTP diperlukan" });
    }

    // Verify OTP
    console.log(
      `[DEBUG] Attempting to verify OTP for ${email} with code: ${otp}`,
    );
    const storedOtp = getOtp(email);
    if (!storedOtp) {
      console.log(`[DEBUG] OTP not found or expired for ${email}`);
      return res.status(401).json({ error: "OTP tidak valid atau kadaluarsa" });
    }

    console.log(
      `[DEBUG] Comparing OTP for ${email}: Expected="${storedOtp.otp}", Received="${otp}"`,
    );
    if (storedOtp.otp !== otp) {
      console.log(
        `[DEBUG] OTP mismatch for ${email}. Expected: ${storedOtp.otp}, Got: ${otp}`,
      );
      return res.status(401).json({ error: "OTP tidak valid" });
    }

    console.log(
      `[DEBUG] OTP successfully verified for ${email}, requestId: ${storedOtp.requestId}`,
    );

    // Delete OTP after verification
    deleteOtp(email);
    console.log(`[DEBUG] OTP deleted for ${email}`);

    // Find user in database
    console.log(`[DEBUG] Looking up user in database for ${email}`);
    const user = await User.findByEmail(email);
    console.log(
      `[DEBUG] Database lookup result:`,
      user
        ? {
            id: user.id,
            email: user.email,
            role: user.role,
          }
        : "USER_NOT_FOUND",
    );

    if (!user) {
      console.log(`[DEBUG] User not found in database for ${email}`);
      return res.status(401).json({ error: "User tidak ditemukan" });
    }

    // Get user profile data
    let userProfile = null;
    if (user.role === "MAHASISWA") {
      userProfile = await Mahasiswa.findByUserId(user.id);
    } else if (user.role === "DOSEN") {
      userProfile = await Dosen.findByUserId(user.id);
    }

    // Create Firebase custom token
    console.log(`[DEBUG] Creating Firebase custom token for user ${user.id}`);
    try {
      const customToken = await admin.auth().createCustomToken(user.id, {
        displayName: user.email,
        role: user.role,
      });
      console.log(`[DEBUG] Firebase custom token created successfully`);
      console.log(`[DEBUG] Custom token length: ${customToken.length}`);
      console.log(
        `[DEBUG] Custom token preview: ${customToken.substring(0, 50)}...`,
      );

      console.log(`[DEBUG] Sending success response for ${email}`);
      res.json({
        message: "Login berhasil",
        customToken: customToken, // Matches frontend expectations
        token: customToken,       // Keeping legacy for compatibility
        role: user.role,          // Matches frontend expectations
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: userProfile,
        },
      });
    } catch (firebaseError: any) {
      console.error(
        `[DEBUG] Firebase error for ${email}:`,
        firebaseError.message,
      );
      return res.status(500).json({ error: "Firebase authentication failed" });
    }
  } catch (error: any) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
