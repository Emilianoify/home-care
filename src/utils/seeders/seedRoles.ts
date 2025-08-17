import "dotenv/config";
import { testDbConnection } from "../../config/db";
import { createDefaultRoles, deleteAllRoles } from "./createRoles";

const runSeeder = async (): Promise<void> => {
  try {
    console.log("🔗 Conectando a la base de datos...");
    await testDbConnection();

    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case "create":
        await createDefaultRoles(true); // verbose = true
        break;

      case "reset":
        await deleteAllRoles();
        await createDefaultRoles(true); // verbose = true
        break;

      case "delete":
        await deleteAllRoles();
        break;

      default:
        console.log("\n📖 USO:");
        console.log("npm run seed:roles create  - Crear roles (sin duplicar)");
        console.log(
          "npm run seed:roles reset   - Eliminar y recrear todos los roles",
        );
        console.log("npm run seed:roles delete  - Eliminar todos los roles");
        break;
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seeder:", error);
    process.exit(1);
  }
};

runSeeder();
