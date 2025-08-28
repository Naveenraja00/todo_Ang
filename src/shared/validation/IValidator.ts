export interface IValidator {
  validate<T>(schema: any, data: unknown): T;
}
