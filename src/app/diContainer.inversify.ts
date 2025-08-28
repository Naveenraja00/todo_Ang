// src/app/diContainer.inversify.ts
import "reflect-metadata";
import { Container } from "inversify";
import { createEventBus } from "@shared/events/eventBusFactory";
import { getLogger } from "@shared/logger";
import { createValidator } from "@shared/validation";
import { createTmsClient } from "@shared/tms/tmsClientFactory";

const inversifyContainer = new Container();
inversifyContainer.bind("EventBus").toConstantValue(createEventBus());
inversifyContainer.bind("Logger").toConstantValue(getLogger());
inversifyContainer.bind("Validator").toConstantValue(createValidator());
inversifyContainer.bind("ITmsClient").toConstantValue(createTmsClient());

export { inversifyContainer };
