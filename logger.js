const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  timeStamp: winston.format.timestamp(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

logger.info("bet slip");

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to console logs
        winston.format.simple()
      ),
    })
  );
}
