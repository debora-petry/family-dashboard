// ==============================
// INMET
// ==============================

import express from "express";
import { getInmetAlerts } from "../services/inmet.js";

const router = express.Router();
console.log("Registrando rota /weather/inmet-alerts");
router.get("/inmet-alerts", async (_req, res) => {
  try {
    const alerts = await getInmetAlerts();
    res.json(alerts);
  } catch (error) {
    console.error("Erro ao buscar alertas do INMET:", error);

    res.status(500).json({
      error: "Erro ao buscar alertas do INMET",
    });
  }
});
export default router;
