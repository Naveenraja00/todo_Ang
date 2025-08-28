import { ITmsClient } from "@shared/tms/ITmsClient";

export class SoapAdapter {
  constructor(private tms: ITmsClient) {}

  async shipmentStatusNormalized(id: string) {
    const data = await this.tms.getShipmentStatus(id, "json");
    // normalize example (real mapping depends on TMS)
    return {
      id,
      raw: data,
      summary: data?.Envelope ? "envelope" : "ok"
    };
  }

  async shipmentHistoryNormalized(id: string) {
    const data = await this.tms.getShipmentHistory(id, "json");
    return { id, events: data?.Envelope?.Body ?? data };
  }
}
