import { Cam } from "onvif";
import type { XmCameraConnection } from "./camera.types.ts";

export class CameraService {
  private readonly host = "192.168.0.3";
  private readonly port = 8899;
  private readonly username = "xfbr";
  private readonly password = "XrMlauYC";

  async connect(): Promise<XmCameraConnection> {
    return new Promise((resolve, reject) => {
      const cam = new Cam(
        {
          hostname: this.host,
          username: this.username,
          password: this.password,
          port: this.port,
        },
        (err: Error | null) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(cam as XmCameraConnection);
        },
      );
    });
  }
  async getSnapshotUri(): Promise<string> {
    const cam = await this.connect();

    return new Promise((resolve, reject) => {
      cam.getSnapshotUri(
        {
          profileToken: cam.defaultProfile.$.token,
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(result.uri.trim());
        },
      );
    });
  }
  /*   async getDeviceInformation(): Promise<unknown> {
    const cam = await this.connect();

    return new Promise((resolve, reject) => {
      cam.getDeviceInformation((err, info) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(info);
      });
    });
  } */
  /*   async getDeviceInformation(): Promise<unknown> {
    const cam = await this.connect();

    return new Promise((resolve, reject) => {
      cam.getDeviceInformation((err: Error | null, info: unknown) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(info);
      });
    });
  } */
}
