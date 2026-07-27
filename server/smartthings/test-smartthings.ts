//import { SmartThingsClient } from "./SmartThingsClient";

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env.development"),
});

async function main() {
  const token = process.env.SMARTTHINGS_TOKEN;

  if (!token) {
    throw new Error("SMARTTHINGS_TOKEN não encontrado no .env.development");
  }

  console.log("Obtendo dispositivos...");

  const response = await fetch("https://api.smartthings.com/v1/devices", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  console.log("Status:", response.status);

  const body = await response.json();

  if (!response.ok) {
    console.error("Erro:");
    console.log(JSON.stringify(body, null, 2));
    return;
  }

  console.log(`Encontrados ${body.items.length} dispositivos:\n`);

  //Lista todos os devices da conta SmartThings - TV e tag julia por agora

  for (const device of body.items) {
    console.log("--------------------------------------");
    console.log("Nome:", device.label);
    console.log("Modelo:", device.name);
    console.log("ID:", device.deviceId);
    console.log("Tipo:", device.type);
    console.log("Room:", device.roomId);
    console.log("Presentation:", device.presentationId);
  }
}

main().catch((err) => {
  console.error(err);
});

/* 

import { SmartThingsClient } from "./SmartThingsClient";

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env.development"),
});

//console.log("cwd:", process.cwd());
//console.log("token:", process.env.SMARTTHINGS_TOKEN);

async function main() {
  const client = new SmartThingsClient(process.env.SMARTTHINGS_TOKEN!);

  const devices = await client.getDevices();

  for (const device of devices) {
    console.log("=================================");
    console.log(device.label);

    const status = await client.getDeviceStatus(device.deviceId);

    console.log(JSON.stringify(status.components.main, null, 2));
  }
}

main();
 */
