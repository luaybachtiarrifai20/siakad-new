import * as admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

console.log(`[DEBUG] Firebase Admin SDK Configuration:`);
console.log(`- Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
console.log(`- Client Email: ${process.env.FIREBASE_CLIENT_EMAIL}`);
console.log(`- Private Key Length: ${privateKey?.length || 0}`);
console.log(`- Private Key Preview: ${privateKey?.substring(0, 50)}...`);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log(`[DEBUG] Firebase Admin SDK initialized successfully`);
  } catch (error: any) {
    console.error(
      `[DEBUG] Firebase Admin SDK initialization failed:`,
      error.message,
    );
  }
}
export default admin;
