import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const network = await prisma.network.upsert({
    where: { id: "seed-network-id" },
    update: {},
    create: {
      id: "seed-network-id",
      name: "Rede Bootstrap",
    },
  });

  const school = await prisma.school.upsert({
    where: { id: "seed-school-id" },
    update: {},
    create: {
      id: "seed-school-id",
      name: "Escola Bootstrap",
      address: "Endereço Bootstrap",
      networkId: network.id,
    },
  });

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const teacher = await prisma.teacher.upsert({
    where: { id: "seed-teacher-id" },
    update: {},
    create: {
      id: "seed-teacher-id",
      name: "Admin",
      document: "00000000000",
      password: hashedPassword,
      birthDate: new Date("1990-01-01"),
      schoolId: school.id,
    },
  });

  console.log("Seed concluído:");
  console.log(`  Rede:      ${network.name} (id: ${network.id})`);
  console.log(`  Escola:    ${school.name}  (id: ${school.id})`);
  console.log(`  Professor: ${teacher.name} (document: ${teacher.document})`);
  console.log("\nCredenciais de login:");
  console.log('  document: "00000000000"');
  console.log('  password: "admin123"');
  console.log('  role:     "teacher"');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
