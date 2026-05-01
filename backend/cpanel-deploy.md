# Panduan Deploy ke cPanel

## 1. Database Setup di cPanel

### Buat Database MySQL
1. Login ke cPanel
2. Cari **MySQL Databases**
3. Buat database baru:
   - Database Name: `siakad_db`
   - User: `siakad_user`
   - Password: `[buat password kuat]`

### Grant Permissions
1. Di halaman yang sama, tambahkan user ke database
2. Berikan semua privileges (ALL PRIVILEGES)

### Import Database Schema
```bash
# Export schema dari development
npx prisma db push --force-reset
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > schema.sql

# Import ke cPanel melalui phpMyAdmin
```

## 2. Konfigurasi Environment

### Update .env untuk Production
```env
# Database cPanel
DATABASE_URL="mysql://siakad_user:PASSWORD@localhost:3306/siakad_db"

# Firebase (sama seperti development)
FIREBASE_PROJECT_ID="siakad-new-6cb49"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@siakad-new-6cb49.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# SMTP (sama seperti development)
SMTP_USER="firebaseluay@gmail.com"
SMTP_PASS="dwckvhgrgrfuoaco"

# Production settings
PORT=8080
FRONTEND_URL="https://domain-anda.com"
NODE_ENV="production"
```

## 3. Build & Deploy

### Build Application
```bash
# Install dependencies
npm install --production

# Build TypeScript
npm run build

# Generate Prisma Client
npx prisma generate
```

### Upload ke cPanel
1. Compress folder `backend` menjadi ZIP
2. Upload ke cPanel File Manager
3. Extract di folder `public_html/backend` atau custom folder

### Setup Node.js di cPanel
1. Di cPanel, cari **Setup Node.js App**
2. Create new application:
   - Node.js Version: 20.x
   - Application Mode: Production
   - Application Root: `/backend`
   - Application URL: `/backend`
   - Application Startup File: `dist/index.js`
   - Environment Variables: tambahkan semua variabel dari .env

### Run Database Migrations
```bash
# Di cPanel Terminal atau SSH
cd backend
npx prisma db push
npx prisma db seed
```

## 4. Testing Connection

### Test Database Connection
```bash
# Di cPanel Terminal
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$connect().then(() => console.log('Database connected!')).catch(console.error);
"
```

### Test SMTP Connection
```bash
# Test email sending
node -e "
require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
transporter.verify().then(() => console.log('SMTP OK!')).catch(console.error);
"
```

## 5. Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check database credentials
   - Verify database user has privileges
   - Ensure MySQL service is running

2. **SMTP Authentication Failed**
   - Verify Gmail App Password
   - Check if 2FA is enabled
   - Ensure correct email format

3. **Application Not Starting**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Check application logs

### Log Locations
- cPanel Error Log: `/home/username/logs/error_log`
- Application Log: Di Node.js App Manager cPanel

## 6. Security Notes

### Important Security Settings
1. **Environment Variables**: Jangan commit .env ke Git
2. **Database Password**: Gunakan password yang kuat
3. **Firebase Keys**: Jangan expose private keys
4. **SSL**: Pastikan HTTPS enabled
5. **Firewall**: Configure appropriate firewall rules

### File Permissions
```bash
# Set correct permissions
chmod 755 backend/
chmod 644 backend/.env
chmod -R 755 backend/dist/
```
