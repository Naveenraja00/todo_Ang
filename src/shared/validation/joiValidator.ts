import Joi from "joi";
import { IValidator } from "./IValidator";
export class JoiValidator implements IValidator {
  validate<T>(schema: Joi.Schema, data: unknown): T {
    const { error, value } = schema.validate(data);
    if (error) throw error;
    return value as T;
  }
}
