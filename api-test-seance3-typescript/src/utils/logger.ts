import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Format personnalisé pour les logs
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `[${timestamp}] ${level}: ${message}`;

  // Ajouter la stack trace si présente
  if (stack) {
    log += `\n${stack}`;
  }

  // Ajouter les métadonnées supplémentaires
  if (Object.keys(meta).length > 0) {
    log += `\n${JSON.stringify(meta, null, 2)}`;
  }

  return log;
});

// Format pour la console (avec couleurs)
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  logFormat
);

// Format pour les fichiers (sans couleurs)
const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  logFormat
);

// Créer le logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [
    // Console - tous les logs
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // Fichier pour les erreurs uniquement
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "error.log"),
      level: "error",
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Fichier pour tous les logs
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "combined.log"),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Méthodes utilitaires pour le logging
export const logError = (error: Error | string, meta?: Record<string, any>) => {
  if (error instanceof Error) {
    logger.error(error.message, { stack: error.stack, ...meta });
  } else {
    logger.error(error, meta);
  }
};

export const logRequest = (
  method: string,
  path: string,
  statusCode?: number,
  duration?: number
) => {
  const message = `${method} ${path}${statusCode ? ` - ${statusCode}` : ""}${
    duration ? ` (${duration}ms)` : ""
  }`;
  if (statusCode && statusCode >= 400) {
    logger.warn(message);
  } else {
    logger.info(message);
  }
};

export const logAuth = (
  action: string,
  email: string,
  success: boolean,
  reason?: string
) => {
  const message = `Auth: ${action} - ${email} - ${
    success ? "SUCCESS" : "FAILED"
  }${reason ? ` (${reason})` : ""}`;
  if (success) {
    logger.info(message);
  } else {
    logger.warn(message);
  }
};

export default logger;
