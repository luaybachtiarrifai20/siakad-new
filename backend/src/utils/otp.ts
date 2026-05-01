import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or host: process.env.SMTP_HOST
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

  console.log(
    `\n=================================\n🔑 MOCK OTP: ${otpCode} (untuk ${email})\n=================================\n`,
  );

  if (
    !process.env.SMTP_USER ||
    process.env.SMTP_USER === "email.kampus@gmail.com"
  ) {
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (err) {
    console.log(
      "Bypassing SMTP error to allow MOCK OTP verification di terminal.",
    );
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digits numeric OTP
};
