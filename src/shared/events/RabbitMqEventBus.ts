import { IEventBus } from "./IEventBus";
import amqp from "amqplib";

export class RabbitMqEventBus implements IEventBus {
  constructor(private url = "amqp://localhost") {}
  async publish(event: string, payload: any) {
    const conn = await amqp.connect(this.url);
    const ch = await conn.createChannel();
    await ch.assertQueue(event, { durable: false });
    ch.sendToQueue(event, Buffer.from(JSON.stringify(payload)));
    await ch.close();
    await conn.close();
  }
  async subscribe(event: string, handler: (payload: any) => void) {
    const conn = await amqp.connect(this.url);
    const ch = await conn.createChannel();
    await ch.assertQueue(event, { durable: false });
    ch.consume(event, msg => {
      if (msg) {
        handler(JSON.parse(msg.content.toString()));
        ch.ack(msg);
      }
    });
  }
}
