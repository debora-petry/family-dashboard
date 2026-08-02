import type { Request, Response } from "express";
import { CameraService } from "./camera.service.ts";

const cameraService = new CameraService();

export class CameraController {
  async snapshot(req: Request, res: Response): Promise<void> {
    //console.info("Camera controller: Método snapshot");

    try {
      const snapshotUrl = await cameraService.getSnapshotUri();

      const response = await fetch(snapshotUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch snapshot.");
      }

      const image = Buffer.from(await response.arrayBuffer());

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "no-store");

      res.send(image);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unable to retrieve camera snapshot.");
    }
  }
}
