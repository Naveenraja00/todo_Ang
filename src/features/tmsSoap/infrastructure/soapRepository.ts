import { createTmsClient } from "@shared/tms/tmsClientFactory";
export class SoapRepository {
  private client = createTmsClient();
  async getStatus(id: string) { return this.client.getShipmentStatus(id, "json"); }
  async getHistory(id: string) { return this.client.getShipmentHistory(id, "json"); }
}
