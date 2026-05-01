import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (
  email: string,
  otpCode: string,
): Promise<void> => {
  const mailOptions = {
    from: `"SIAKAD" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Kode OTP Login SIAKAD",
    text: `Kode OTP Anda adalah: ${otpCode}. Masukkan kode ini untuk menyelesaikan proses verifikasi. Kode ini bersifat rahasia.`,
    html: `<h3>Kode OTP Anda adalah: <b>${otpCode}</b></h3><p>Masukkan kode ini untuk menyelesaikan proses verifikasi. Kode ini bersifat rahasia.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP berhasil dikirim ke ${email}`);
  } catch (err) {
    console.error("Gagal mengirim OTP:", err);
    throw err;
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digits numeric OTP
};
