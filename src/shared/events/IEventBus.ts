export interface IEventBus {
  publish(event: string, payload: any): Promise<void> | void;
  subscribe(event: string, handler: (payload: any) => void | Promise<void>): Promise<void> | void;
}
