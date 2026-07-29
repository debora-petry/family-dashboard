import { Router } from "express";
import { CameraController } from "./camera.controller.ts";

const router = Router();
const controller = new CameraController();

router.get("/snapshot", (req, res) => controller.snapshot(req, res));
console.log("camera.routes carregado");
export default router;
