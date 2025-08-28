// src/app/server.ts
import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { ENV } from "./config/env";
import { selectContainer } from "./diContainer";
import { registerRoutes } from "./routes";
import { setupGraphQL } from "./graphqlServer";

import { getLogger } from "@shared/logger";
import { createValidator } from "@shared/validation";
import { createEventBus } from "@shared/events/eventBusFactory";
import { createSoapClient } from "@shared/soap/soapClientFactory";
import { createTmsClient } from "@shared/tms/tmsClientFactory";

async function bootstrap() {
  // Create shared instances once at startup (composition root)
  const logger = getLogger();
  const validator = createValidator();
  const eventBus = createEventBus();
  const soapClient = createSoapClient();
  const tmsClient = createTmsClient();

  // select DI container (manual / tsyringe / inversify)
  const container = selectContainer();

  // If tsyringe/inversify container, register instances. For manual container symbol is direct object.
  if (container && typeof container.registerInstance === "function") {
    // tsyringe style
    container.registerInstance("Logger", logger);
    container.registerInstance("Validator", validator);
    container.registerInstance("EventBus", eventBus);
    container.registerInstance("SoapClient", soapClient);
    container.registerInstance("ITmsClient", tmsClient);
  } else if (container && container.logger) {
    // manual container already constructed in diContainer.manual
    // override or use as-is
    container.logger = logger;
    container.validator = validator;
    container.eventBus = eventBus;
    container.tmsClient = tmsClient;
  } else if (container && typeof container.bind === "function") {
    // inversify style
    container.bind("Logger").toConstantValue(logger);
    container.bind("Validator").toConstantValue(validator);
    container.bind("EventBus").toConstantValue(eventBus);
    container.bind("SoapClient").toConstantValue(soapClient);
    container.bind("ITmsClient").toConstantValue(tmsClient);
  }

  const app = express();
  app.use(bodyParser.json());

  // attach basic health route
  registerRoutes(app);

  // GraphQL endpoint
  await setupGraphQL(app);

  const port = Number(ENV.PORT) || 3000;
  app.listen(port, () => {
    logger.info(`🚀 Server listening on http://localhost:${port}`);
    logger.info(`🚀 GraphQL ready at http://localhost:${port}/graphql`);
  });
}

bootstrap().catch(err => {
  console.error("Bootstrap failed", err);
  process.exit(1);
});
