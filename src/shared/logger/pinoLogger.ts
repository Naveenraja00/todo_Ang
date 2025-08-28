import pino from "pino";
import { ILogger } from "./ILogger";
const _logger = pino();
export class PinoLogger implements ILogger {
  info(m: string, meta?: any){ _logger.info(meta||{}, m); }
  warn(m: string, meta?: any){ _logger.warn(meta||{}, m); }
  error(m: string, meta?: any){ _logger.error(meta||{}, m); }
  debug(m: string, meta?: any){ _logger.debug(meta||{}, m); }
}
