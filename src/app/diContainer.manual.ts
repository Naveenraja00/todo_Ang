// src/app/diContainer.manual.ts
import { createEventBus } from "@shared/events/eventBusFactory";
import { getLogger } from "@shared/logger";
import { createValidator } from "@shared/validation";
import { createTmsClient } from "@shared/tms/tmsClientFactory";

export const manualContainer = {
  eventBus: createEventBus(),
  logger: getLogger(),
  validator: createValidator(),
  tmsClient: createTmsClient()
};
