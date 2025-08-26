import { Router } from "express";
import { SoapRepository } from "../../infrastructure/soapRepository";
const router = Router();
const repo = new SoapRepository();

router.get("/status/:id", async (req, res) => {
  try {
    const r = await repo.getStatus(req.params.id);
    res.json(r);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/history/:id", async (req, res) => {
  try {
    const r = await repo.getHistory(req.params.id);
    res.json(r);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
