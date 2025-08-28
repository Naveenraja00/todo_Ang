import { z } from "zod";
import { IValidator } from "./IValidator";
export class ZodValidator implements IValidator {
  validate<T>(schema: z.ZodTypeAny, data: unknown): T {
    return schema.parse(data);
  }
}
