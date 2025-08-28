// src/app/diContainer.tsyringe.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { createEventBus } from "@shared/events/eventBusFactory";
import { getLogger } from "@shared/logger";
import { createValidator } from "@shared/validation";
import { createTmsClient } from "@shared/tms/tmsClientFactory";

container.registerInstance("EventBus", createEventBus());
container.registerInstance("Logger", getLogger());
container.registerInstance("Validator", createValidator());
container.registerInstance("ITmsClient", createTmsClient());

export { container };
