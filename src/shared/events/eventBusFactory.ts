import { ENV } from "@app/config/env";
import { IEventBus } from "./IEventBus";
import { InMemoryEventBus } from "./InMemoryEventBus";
import { KafkaEventBus } from "./KafkaEventBus";
import { RabbitMqEventBus } from "./RabbitMqEventBus";

export function createEventBus(): IEventBus {
  switch (ENV.EVENT_BUS) {
    case "kafka":
      // Example: read brokers from env.TMS_ENDPOINT just for placeholder; replace in prod
      return new KafkaEventBus(["localhost:9092"], "app");
    case "rabbitmq":
      return new RabbitMqEventBus("amqp://localhost");
    case "memory":
    default:
      return new InMemoryEventBus();
  }
}
