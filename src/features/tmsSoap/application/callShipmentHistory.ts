import { ITmsClient } from "@shared/tms/ITmsClient";
export async function callShipmentHistory(tmsClient: ITmsClient, id: string) {
  return tmsClient.getShipmentHistory(id, "json");
}
