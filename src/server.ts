import app from "./app";
import { SUCCESS_MESSAGES } from "./utils/constants/messages/success.messages";
import { testDbConnection } from "./config/db";
import { ERROR_MESSAGES } from "./utils/constants/messages/error.messages";

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    await testDbConnection();
    app.listen(PORT, () => {
      console.log(`${SUCCESS_MESSAGES.SERVER.STARTUP} ${PORT}`);
    });
  } catch (error) {
    console.error(ERROR_MESSAGES.SERVER.STARTUP, error);
    process.exit(1);
  }
};

startServer();
