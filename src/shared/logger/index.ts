import { ENV } from "@app/config/env";
import { ILogger } from "./ILogger";
import { ConsoleLogger } from "./consoleLogger";
import { PinoLogger } from "./pinoLogger";

export function getLogger(): ILogger {
  switch (ENV.LOGGER) {
    case "pino": return new PinoLogger();
    default: return new ConsoleLogger();
  }
}
