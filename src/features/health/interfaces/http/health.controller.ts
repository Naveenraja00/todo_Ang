import { Router } from "express";
import { checkHealth } from "../../application/checkHealth";
const router = Router();

router.get("/", (_req, res) => {
  res.json(checkHealth());
});

export default router;
