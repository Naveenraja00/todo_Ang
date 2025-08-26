import { Router } from "express";
import { sayHello } from "../../application/sayHello";
const router = Router();

router.get("/", (req, res) => {
  const name = req.query.name as string | undefined;
  res.json(sayHello(name));
});

export default router;
