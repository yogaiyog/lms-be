import { PrismaClient } from "@prisma/client";

const OLD_URL = "http://103.93.160.76:9000/lms-images/";
const NEW_URL = "https://juniortechcompetition.web.id/storage/";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating image URLs...");

  const tables = [
    { name: "Gallery", field: "imageUrl" },
    { name: "Topic", field: "imageUrl" },
    { name: "Badge", field: "imageUrl" },
    { name: "TutorProfile", field: "avatarUrl" },
    { name: "StudentProfile", field: "avatarUrl" },
  ];

  for (const table of tables) {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE "${table.name}" SET "${table.field}" = REPLACE("${table.field}", '${OLD_URL}', '${NEW_URL}') WHERE "${table.field}" LIKE '%${OLD_URL}%'`
    );
    console.log(`✓ ${table.name}.${table.field}: ${result} rows updated`);
  }

  console.log("\nDone!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
