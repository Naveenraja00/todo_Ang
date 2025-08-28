// src/app/diContainer.ts
import { ENV } from "./config/env";

export function selectContainer() {
  switch (ENV.DI_MODE) {
    case "tsyringe":
      return require("./diContainer.tsyringe").container;
    case "inversify":
      return require("./diContainer.inversify").inversifyContainer;
    case "manual":
    default:
      return require("./diContainer.manual").manualContainer;
  }
}
