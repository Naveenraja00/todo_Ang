import { ITmsClient } from "@shared/tms/ITmsClient";
export async function callShipmentStatus(tmsClient: ITmsClient, id: string) {
  return tmsClient.getShipmentStatus(id, "json");
}
