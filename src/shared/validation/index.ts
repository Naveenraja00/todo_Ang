import { ENV } from "@app/config/env";
import { IValidator } from "./IValidator";
import { ZodValidator } from "./zodValidator";
import { JoiValidator } from "./joiValidator";

export function createValidator(): IValidator {
  switch (ENV.VALIDATOR) {
    case "joi": return new JoiValidator();
    default: return new ZodValidator();
  }
}
