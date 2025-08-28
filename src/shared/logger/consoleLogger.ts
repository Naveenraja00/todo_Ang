import { ILogger } from "./ILogger";
export class ConsoleLogger implements ILogger {
  info(m: string, meta?: any){ console.log("[INFO]", m, meta||""); }
  warn(m: string, meta?: any){ console.warn("[WARN]", m, meta||""); }
  error(m: string, meta?: any){ console.error("[ERROR]", m, meta||""); }
  debug(m: string, meta?: any){ console.debug("[DEBUG]", m, meta||""); }
}
