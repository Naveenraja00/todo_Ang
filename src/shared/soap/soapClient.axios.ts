import axios from "axios";
import { ISoapClient } from "./ISoapClient";
import { ENV } from "@app/config/env";

export class AxiosSoapClient implements ISoapClient {
  private endpoint = ENV.TMS_ENDPOINT;
  private username = ENV.TMS_USER;
  private password = ENV.TMS_PASS;

  async call(method: string, payload: any): Promise<string> {
    const xml = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body><${method}>${Object.entries(payload).map(([k,v])=>`<${k}>${v}</${k}>`).join("")}</${method}></soap:Body>
    </soap:Envelope>`;
    const res = await axios.post(this.endpoint, xml, {
      headers: { "Content-Type": "text/xml" },
      auth: { username: this.username, password: this.password }
    });
    return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
  }
}
