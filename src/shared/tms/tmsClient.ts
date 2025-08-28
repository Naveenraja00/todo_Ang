import { ITmsClient } from "./ITmsClient";
import { ISoapClient } from "@shared/soap/ISoapClient";
import { parseStringPromise } from "xml2js";

export class TmsClient implements ITmsClient {
  constructor(private soapClient: ISoapClient) {}

  private async toJson(xmlOrObject: any) {
    if (typeof xmlOrObject === "string") {
      try { return await parseStringPromise(xmlOrObject); } catch { return { raw: xmlOrObject }; }
    }
    return xmlOrObject; // already object
  }

  async getShipmentStatus(shipmentId: string, format: "json"|"xml" = "json") {
    const raw = await this.soapClient.call("GetShipmentStatus", { shipmentId });
    if (format === "xml") return raw;
    return this.toJson(raw);
  }

  async getShipmentHistory(shipmentId: string, format: "json"|"xml" = "json") {
    const raw = await this.soapClient.call("GetShipmentHistory", { shipmentId });
    if (format === "xml") return raw;
    return this.toJson(raw);
  }
}
