export interface ITmsClient {
  getShipmentStatus(shipmentId: string, format?: "json" | "xml"): Promise<any>;
  getShipmentHistory(shipmentId: string, format?: "json" | "xml"): Promise<any>;
}
