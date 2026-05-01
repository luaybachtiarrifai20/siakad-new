import express from 'express';
import bcrypt from 'bcryptjs';
import { User, Mahasiswa, Dosen } from '../utils/database-simple';
import { generateOTP } from '../utils/otp';
import { sendOTP } from '../utils/otp';
import { setOtp, getOtp, deleteOtp } from '../utils/otpStore';
import admin from 'firebase-admin';

const router = express.Router();

// Request OTP endpoint
router.post('/request-otp', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password diperlukan' });
    }

    // Find user in database
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password salah' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP
    setOtp(email, otp);
    
    // Send OTP via email
    try {
      await sendOTP(email, otp);
      console.log(`OTP berhasil dikirim ke ${email}`);
    } catch (emailError) {
      console.error('Gagal mengirim OTP:', emailError);
      return res.status(500).json({ error: 'Gagal mengirim OTP' });
    }

    res.json({ 
      message: 'OTP berhasil dikirim',
      email: email,
      // For development only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined 
    });

  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email dan OTP diperlukan' });
    }

    // Verify OTP
    const storedOtp = getOtp(email);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(401).json({ error: 'OTP tidak valid atau kadaluarsa' });
    }

    // Delete OTP after verification
    deleteOtp(email);

    // Find user in database
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }

    // Get user profile data
    let userProfile = null;
    if (user.role === 'MAHASISWA') {
      userProfile = await Mahasiswa.findByUserId(user.id);
    } else if (user.role === 'DOSEN') {
      userProfile = await Dosen.findByUserId(user.id);
    }

    // Create Firebase custom token
    const customToken = await admin.auth().createCustomToken(user.id, {
      displayName: user.email,
      role: user.role
    });

    res.json({
      message: 'Login berhasil',
      token: customToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: userProfile
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
