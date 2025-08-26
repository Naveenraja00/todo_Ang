import { Container } from "inversify";
import { TYPES } from "./inversify.types";

// Shared
import { ILogger } from "@/shared/logger/ILogger";
import { ConsoleLogger } from "@/shared/logger/consoleLogger";
import { PinoLogger } from "@/shared/logger/pinoLogger";

import { IValidator } from "@/shared/validation/IValidator";
import { JoiValidator } from "@/shared/validation/joiValidator";
import { ZodValidator } from "@/shared/validation/zodValidator";

import { IEventBus } from "@/shared/events/IEventBus";
import { InMemoryEventBus } from "@/shared/events/InMemoryEventBus";

import { ISoapClient } from "@/shared/soap/ISoapClient";
import { StrongSoapClient } from "@/shared/soap/soapClient.strong";
import { AxiosSoapClient } from "@/shared/soap/soapClient.axios";

// Feature Repos
import { HealthRepository } from "@/features/health/infrastructure/healthRepository";
import { HelloRepository } from "@/features/hello/infrastructure/helloRepository";
import { TmsSoapRepository } from "@/features/tmsSoap/infrastructure/soapRepository";

// Config
import config from "@/app/config/env";

const container = new Container();

// Logger
if (config.logger === "pino") {
  container.bind<ILogger>(TYPES.Logger).to(PinoLogger).inSingletonScope();
} else {
  container.bind<ILogger>(TYPES.Logger).to(ConsoleLogger).inSingletonScope();
}

// Validator
if (config.validator === "zod") {
  container.bind<IValidator>(TYPES.Validator).to(ZodValidator).inSingletonScope();
} else {
  container.bind<IValidator>(TYPES.Validator).to(JoiValidator).inSingletonScope();
}

// EventBus (could add Kafka or Rabbit later)
container.bind<IEventBus>(TYPES.EventBus).to(InMemoryEventBus).inSingletonScope();

// SOAP client
if (config.soapClient === "axios") {
  container.bind<ISoapClient>(TYPES.SoapClient).to(AxiosSoapClient).inSingletonScope();
} else {
  container.bind<ISoapClient>(TYPES.SoapClient).to(StrongSoapClient).inSingletonScope();
}

// Features
container.bind<HealthRepository>(TYPES.HealthRepository).to(HealthRepository);
container.bind<HelloRepository>(TYPES.HelloRepository).to(HelloRepository);
container.bind<TmsSoapRepository>(TYPES.TmsSoapRepository).to(TmsSoapRepository);

export { container };
