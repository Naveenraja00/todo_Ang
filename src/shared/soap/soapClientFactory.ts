import { ENV } from "@app/config/env";
import { ISoapClient } from "./ISoapClient";
import { AxiosSoapClient } from "./soapClient.axios";
import { StrongSoapClient } from "./soapClient.strong";

export function createSoapClient(): ISoapClient {
  switch (ENV.SOAP_ENGINE) {
    case "strong-soap": return new StrongSoapClient();
    case "axios":
    default: return new AxiosSoapClient();
  }
}
