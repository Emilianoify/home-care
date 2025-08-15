export const ERROR_MESSAGES = {
  DB: {
    DB_CONNECTION: "Error al conectar con la base de datos.",
    DB_SYNC: "Error al sincronizar la base de datos.",
  },
  SERVER: {
    STARTUP: "Error al iniciar el servidor.",
  },
  ROUTING: {
    NOT_FOUND: "Ruta no encontrada.",
  },
  USER: {
    USER_CREATION: "Error al crear el usuario.",
    INVALID_USERNAME: "Username debe contener solo letras y números",
    INVALID_EMAIL: "Debe ser un email válido",
  },
  ROLE: { ROLE_CREATION: "Error al crear el rol." },

  PATIENT: { PATIENT_CREATION: "Error al crear el paciente." },
  PROFESSIONAL: { PROFESSIONAL_CREATION: "Error al crear el profesional." },
};
