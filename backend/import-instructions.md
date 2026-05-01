# Panduan Import Database ke cPanel

## ✅ Export Berhasil!

Database sudah berhasil di-export ke `siakad_database_export.sql`

## 📋 Langkah Import ke cPanel:

### 1. Login ke cPanel

- Buka browser → `https://domain-anda.com:2083`
- Login dengan username dan password cPanel

### 2. Buka phpMyAdmin

- Di cPanel, cari **phpMyAdmin**
- Klik untuk membuka phpMyAdmin

### 3. Pilih Database

- Di phpMyAdmin, pilih database `vsagtmfw_siakad` dari dropdown
- Jika belum ada, buat database baru dengan nama ini

### 4. Import File SQL

- Klik tab **Import**
- Pilih file `siakad_database_export_final.sql` dari komputer Anda
- Atur pengaturan:
  - **Format**: SQL
  - **Character set**: utf8mb4
  - **Enable foreign key checks**: **UNCENTANG** (DISABLE)
  - **Disable foreign key checks** saat import

### 5. Jalankan Import

- Klik tombol **Go** atau **Import**
- Tunggu proses selesai

### 6. Verifikasi Import

Setelah import selesai:

1. Cek semua tabel sudah ter-import
2. Pastikan data ada di setiap tabel
3. Test koneksi aplikasi

## 🔧 Konfigurasi Setelah Import

Update file `.env` dengan database credentials cPanel:

```env
# Jika import berhasil
DATABASE_URL="mysql://vsagtmfw_luay:Luay2008_@libraayra.my.id:3306/vsagtmfw_siakad"

# Test koneksi
npx prisma db push
```

## 🚨 Troubleshooting

### Error Saat Import:

1. **File too large**:
   - Split file menjadi beberapa bagian
   - Atau gunakan `max_execution_time` di php.ini

2. **Foreign key constraint**:
   - Import tanpa foreign key checks
   - Enable setelah import selesai

3. **Character encoding**:
   - Gunakan utf8mb4
   - Convert file encoding jika perlu

### Error Saat Koneksi:

1. **Access denied**:
   - Cek user permissions di cPanel
   - Pastikan user punya akses ke database

2. **Connection timeout**:
   - Tambah parameter `connect_timeout=60`
   - Cek firewall settings

## ✅ Test Setelah Import

```bash
# Test koneksi database
npx prisma db push

# Test query data
npx prisma studio
```

Jika semua berhasil, aplikasi siap digunakan dengan database cPanel!
