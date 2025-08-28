// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "3000",
  DI_MODE: process.env.DI_MODE || "manual",        // manual | tsyringe | inversify
  SOAP_ENGINE: process.env.SOAP_ENGINE || "axios", // axios | strong-soap
  EVENT_BUS: process.env.EVENT_BUS || "memory",    // memory | kafka | rabbitmq
  VALIDATOR: process.env.VALIDATOR || "zod",       // zod | joi
  LOGGER: process.env.LOGGER || "console",         // console | pino

  // TMS credentials (example)
  TMS_ENDPOINT: process.env.TMS_ENDPOINT || "http://example.com/soap",
  TMS_WSDL: process.env.TMS_WSDL || "",
  TMS_USER: process.env.TMS_USER || "",
  TMS_PASS: process.env.TMS_PASS || ""
};
