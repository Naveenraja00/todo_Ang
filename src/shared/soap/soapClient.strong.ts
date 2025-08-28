import * as soap from "strong-soap";
import { ISoapClient } from "./ISoapClient";
import { ENV } from "@app/config/env";

export class StrongSoapClient implements ISoapClient {
  private wsdl = ENV.TMS_WSDL || ENV.TMS_ENDPOINT;
  private username = ENV.TMS_USER;
  private password = ENV.TMS_PASS;

  async call(method: string, payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      soap.soap.createClient(this.wsdl, {}, (err: any, client: any) => {
        if (err) return reject(err);
        if (this.username && this.password) client.setSecurity(new soap.BasicAuthSecurity(this.username, this.password));
        client[method](payload, (err2: any, result: any) => {
          if (err2) return reject(err2);
          // strong-soap typically returns JS object; transform to string for consistency
          resolve(typeof result === "string" ? result : JSON.stringify(result));
        });
      });
    });
  }
}
