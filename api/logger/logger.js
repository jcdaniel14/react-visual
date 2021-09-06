const moment = require("moment");
const { createLogger, format, transports } = require("winston");
const MESSAGE = Symbol.for("message");

const jsonFmt = (logEntry) => {
  const base = { timestamp: moment().format("YYYY-MM-DD HH:mm:ss") };
  const json = Object.assign(base, logEntry);
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
};

let filename = "./logs/combined.log";

module.exports = createLogger({
  level: "info",
  format: format(jsonFmt)(),
  transports: [
    new transports.File({
      filename: filename,
      maxsize: 5120000,
      maxFiles: 5,
    }),
    new transports.Console(),
  ],
});
