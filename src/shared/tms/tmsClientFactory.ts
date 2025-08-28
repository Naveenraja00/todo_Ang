import { createSoapClient } from "@shared/soap/soapClientFactory";
import { ITmsClient } from "./ITmsClient";
import { TmsClient } from "./tmsClient";

export function createTmsClient(): ITmsClient {
  const soap = createSoapClient();
  return new TmsClient(soap);
}
