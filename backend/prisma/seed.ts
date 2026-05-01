import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "Kampus@123";

async function main() {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const usersToSeed = [
    {
      email: "superadmin@kampus.ac.id",
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
    { email: "akademik@kampus.ac.id", name: "Admin Akademik", role: "ADMIN" },
    { email: "dosen@kampus.ac.id", name: "Dosen Pengajar", role: "DOSEN" },
    {
      email: "mahasiswa@kampus.ac.id",
      name: "Mahasiswa Aktif",
      role: "MAHASISWA",
    },
    { email: "kaprodi@kampus.ac.id", name: "Ketua Prodi", role: "KAPRODI" },
    { email: "dekan@kampus.ac.id", name: "Dekan Fakultas", role: "DEKAN" },
    {
      email: "keuangan@kampus.ac.id",
      name: "Bagian Keuangan",
      role: "KEUANGAN",
    },
  ];

  console.log(`Seeding users with password: ${DEFAULT_PASSWORD}`);

  for (const u of usersToSeed) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashedPassword },
      create: {
        firebaseUid: `mock-uid-${u.role.toLowerCase()}`,
        email: u.email,
        name: u.name,
        password: hashedPassword,
        // @ts-ignore
        role: u.role,
      },
    });
    console.log(`✓ ${u.email} (${u.role})`);
  }

  console.log(`\nDefault password: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
