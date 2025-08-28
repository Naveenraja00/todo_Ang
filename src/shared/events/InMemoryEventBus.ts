import { IEventBus } from "./IEventBus";
export class InMemoryEventBus implements IEventBus {
  private handlers: Record<string, ((payload: any) => void | Promise<void>)[]> = {};
  publish(event: string, payload: any): void { (this.handlers[event] || []).forEach(h => h(payload)); }
  subscribe(event: string, handler: (payload: any) => void): void {
    this.handlers[event] = this.handlers[event] || [];
    this.handlers[event].push(handler);
  }
}
