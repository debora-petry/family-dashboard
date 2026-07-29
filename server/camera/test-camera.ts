import { CameraService } from "./camera.service";

async function main() {
  const camera = new CameraService();

  console.log("Conectando...");

  //const cam = await camera.connect();
  console.log("Conectou!");

  console.log(await camera.getSnapshotUri());

  //const info = await camera.getDeviceInformation();

  //console.log(info);
}

main().catch(console.error);
