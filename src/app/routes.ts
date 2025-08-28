// src/app/routes.ts
import { Express } from "express";
import healthRoutes from "@features/health/interfaces/http/health.routes";
import helloRoutes from "@features/hello/interfaces/http/hello.routes";
import tmsRoutes from "@features/tmsSoap/interfaces/http/tmsSoap.routes";

export function registerRoutes(app: Express) {
  app.use("/api/health", healthRoutes);
  app.use("/api/hello", helloRoutes);
  app.use("/api/tms", tmsRoutes);
}
