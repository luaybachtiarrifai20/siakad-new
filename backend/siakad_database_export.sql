-- SIAKAD Database Export
-- Generated: 2026-05-01T13:22:26.429Z
SET FOREIGN_KEY_CHECKS = 0;

-- Table structure for `Dosen`
DROP TABLE IF EXISTS `Dosen`;
CREATE TABLE `Dosen` (
  `id` varchar(191) NOT NULL,
  `nidn` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Dosen_nidn_key` (`nidn`),
  UNIQUE KEY `Dosen_userId_key` (`userId`),
  CONSTRAINT `Dosen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `Fakultas`
DROP TABLE IF EXISTS `Fakultas`;
CREATE TABLE `Fakultas` (
  `id` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `Jadwal`
DROP TABLE IF EXISTS `Jadwal`;
CREATE TABLE `Jadwal` (
  `id` varchar(191) NOT NULL,
  `kelasId` varchar(191) NOT NULL,
  `hari` varchar(191) NOT NULL,
  `jamMulai` varchar(191) NOT NULL,
  `jamSelesai` varchar(191) NOT NULL,
  `ruangan` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Jadwal_kelasId_fkey` (`kelasId`),
  CONSTRAINT `Jadwal_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `Kelas` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `Kelas`
DROP TABLE IF EXISTS `Kelas`;
CREATE TABLE `Kelas` (
  `id` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `mataKuliahId` varchar(191) NOT NULL,
  `dosenId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Kelas_mataKuliahId_fkey` (`mataKuliahId`),
  KEY `Kelas_dosenId_fkey` (`dosenId`),
  CONSTRAINT `Kelas_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Kelas_mataKuliahId_fkey` FOREIGN KEY (`mataKuliahId`) REFERENCES `MataKuliah` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `Krs`
DROP TABLE IF EXISTS `Krs`;
CREATE TABLE `Krs` (
  `id` varchar(191) NOT NULL,
  `mahasiswaId` varchar(191) NOT NULL,
  `kelasId` varchar(191) NOT NULL,
  `nilai` double DEFAULT NULL,
  `grade` varchar(191) DEFAULT NULL,
  `semester` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Krs_mahasiswaId_fkey` (`mahasiswaId`),
  KEY `Krs_kelasId_fkey` (`kelasId`),
  CONSTRAINT `Krs_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `Kelas` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Krs_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `Mahasiswa` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `Mahasiswa`
DROP TABLE IF EXISTS `Mahasiswa`;
CREATE TABLE `Mahasiswa` (
  `id` varchar(191) NOT NULL,
  `nim` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `prodiId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Mahasiswa_nim_key` (`nim`),
  UNIQUE KEY `Mahasiswa_userId_key` (`userId`),
  KEY `Mahasiswa_prodiId_fkey` (`prodiId`),
  CONSTRAINT `Mahasiswa_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `Prodi` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Mahasiswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `MataKuliah`
DROP TABLE IF EXISTS `MataKuliah`;
CREATE TABLE `MataKuliah` (
  `id` varchar(191) NOT NULL,
  `kode` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `sks` int(11) NOT NULL,
  `prodiId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `MataKuliah_kode_key` (`kode`),
  KEY `MataKuliah_prodiId_fkey` (`prodiId`),
  CONSTRAINT `MataKuliah_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `Prodi` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `Pembayaran`
DROP TABLE IF EXISTS `Pembayaran`;
CREATE TABLE `Pembayaran` (
  `id` varchar(191) NOT NULL,
  `tagihanId` varchar(191) NOT NULL,
  `jumlahBayar` double NOT NULL,
  `tanggal` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `metode` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Pembayaran_tagihanId_fkey` (`tagihanId`),
  CONSTRAINT `Pembayaran_tagihanId_fkey` FOREIGN KEY (`tagihanId`) REFERENCES `TagihanUKT` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `Presensi`
DROP TABLE IF EXISTS `Presensi`;
CREATE TABLE `Presensi` (
  `id` varchar(191) NOT NULL,
  `kelasId` varchar(191) NOT NULL,
  `pertemuanKe` int(11) NOT NULL,
  `tanggal` datetime(3) NOT NULL,
  `dataHadir` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`dataHadir`)),
  PRIMARY KEY (`id`),
  KEY `Presensi_kelasId_fkey` (`kelasId`),
  CONSTRAINT `Presensi_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `Kelas` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `Prodi`
DROP TABLE IF EXISTS `Prodi`;
CREATE TABLE `Prodi` (
  `id` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `fakultasId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Prodi_fakultasId_fkey` (`fakultasId`),
  CONSTRAINT `Prodi_fakultasId_fkey` FOREIGN KEY (`fakultasId`) REFERENCES `Fakultas` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `TagihanUKT`
DROP TABLE IF EXISTS `TagihanUKT`;
CREATE TABLE `TagihanUKT` (
  `id` varchar(191) NOT NULL,
  `mahasiswaId` varchar(191) NOT NULL,
  `semester` varchar(191) NOT NULL,
  `jumlah` double NOT NULL,
  `status` enum('PENDING','LUNAS','CICILAN') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  KEY `TagihanUKT_mahasiswaId_fkey` (`mahasiswaId`),
  CONSTRAINT `TagihanUKT_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `Mahasiswa` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `User`
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` varchar(191) NOT NULL,
  `firebaseUid` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','DOSEN','MAHASISWA','KAPRODI','DEKAN','KEUANGAN') NOT NULL DEFAULT 'MAHASISWA',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_firebaseUid_key` (`firebaseUid`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `User`
INSERT INTO `User` VALUES ('1505052c-e6ef-4b74-b54a-0258d0e9198c', 'mock-uid-admin', 'akademik@kampus.ac.id', 'Admin Akademik', '$2b$10$JcbxzMQzecCA7dcbHA/yn.01miIb5vZqlM7ubLOgaMqyoBLSQMV3W', 'ADMIN', '2026-05-01 05:07:51', '2026-05-01 05:07:51'),('2ed6b778-5e9c-4328-8a47-274a8bb7dd22', 'mock-uid-kaprodi', 'kaprodi@kampus.ac.id', 'Ketua Prodi', '$2b$10$JcbxzMQzecCA7dcbHA/yn.01miIb5vZqlM7ubLOgaMqyoBLSQMV3W', 'KAPRODI', '2026-05-01 05:07:51', '2026-05-01 05:07:51'),('5aab946d-f7a0-4140-9874-5cc7e717d16d', 'mock-uid-mahasiswa', 'mahasiswa@kampus.ac.id', 'Mahasiswa Aktif', '$2b$10$JcbxzMQzecCA7dcbHA/yn.01miIb5vZqlM7ubLOgaMqyoBLSQMV3W', 'MAHASISWA', '2026-05-01 05:07:51', '2026-05-01 05:07:51'),('72f4fed4-5a85-45e7-a6d1-2d64882c5b28', 'mock-uid-keuangan', 'keuangan@kampus.ac.id', 'Bagian Keuangan', '$2b$10$JcbxzMQzecCA7dcbHA/yn.01miIb5vZqlM7ubLOgaMqyoBLSQMV3W', 'KEUANGAN', '2026-05-01 05:07:51', '2026-05-01 05:07:51'),('a1313f30-a1ff-4de0-9d07-90252c923e6f', 'mock-uid-dekan', 'dekan@kampus.ac.id', 'Dekan Fakultas', '$2b$10$JcbxzMQzecCA7dcbHA/yn.01miIb5vZqlM7ubLOgaMqyoBLSQMV3W', 'DEKAN', '2026-05-01 05:07:51', '2026-05-01 05:07:51'),('b05a9e66-be3b-4a1e-8d35-71c3df544444', 'mock-uid-super_admin', 'superadmin@kampus.ac.id', 'Super Admin', '$2b$10$JcbxzMQzecCA7dcbHA/yn.01miIb5vZqlM7ubLOgaMqyoBLSQMV3W', 'SUPER_ADMIN', '2026-05-01 05:07:51', '2026-05-01 05:07:51'),('d616abfe-5523-49a2-ad06-39e798f4124a', 'mock-uid-dosen', 'dosen@kampus.ac.id', 'Dosen Pengajar', '$2b$10$JcbxzMQzecCA7dcbHA/yn.01miIb5vZqlM7ubLOgaMqyoBLSQMV3W', 'DOSEN', '2026-05-01 05:07:51', '2026-05-01 05:07:51');

-- Table structure for `_prisma_migrations`
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `_prisma_migrations`
INSERT INTO `_prisma_migrations` VALUES ('4b6716c2-570b-4060-b4df-c7657d24108e', 'eb2b034abbce2d32da0a278104d3e4d7826737b7c4e2a57464d2cdf0c19c9268', '2026-05-01 05:07:46', '20260501120746_first', NULL, NULL, '2026-05-01 05:07:46', 1);

SET FOREIGN_KEY_CHECKS = 1;
