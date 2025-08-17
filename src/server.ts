import app from "./app";
import { SUCCESS_MESSAGES } from "./utils/constants/messages/success.messages";
import { ERROR_MESSAGES } from "./utils/constants/messages/error.messages";
import { testDbConnection } from "./config/db";
import { createDefaultRoles } from "./utils/seeders/createRoles";
import sequelize from "./config/db";
import "./models";

const PORT = process.env.PORT || 3000;

const initializeDatabase = async (): Promise<void> => {
  try {
    console.log("🔗 Conectando a la base de datos...");
    await testDbConnection();

    console.log("🏗️  Sincronizando modelos con la base de datos...");
    await sequelize.sync({ alter: true });
    console.log(SUCCESS_MESSAGES.DB.DB_SYNCED);

    console.log("🌱 Inicializando datos por defecto...");
    await createDefaultRoles();

    console.log("✅ Base de datos inicializada correctamente\n");
  } catch (error) {
    console.error("❌ Error inicializando la base de datos:", error);
    throw error;
  }
};

const startServer = async (): Promise<void> => {
  try {
    // Inicializar base de datos y datos por defecto
    await initializeDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`${SUCCESS_MESSAGES.SERVER.STARTUP} ${PORT}`);
      console.log("🚀 Servidor listo para recibir peticiones\n");
    });
  } catch (error) {
    console.error(ERROR_MESSAGES.SERVER.STARTUP, error);
    process.exit(1);
  }
};

startServer();
