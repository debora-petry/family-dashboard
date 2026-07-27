import axios, { AxiosInstance } from "axios";
import { SmartThingsDevice } from "./types";

export class SmartThingsClient {
  private readonly client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: "https://api.smartthings.com/v1",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  }

  /**
   * Lista todos os dispositivos da conta.
   */
  public async getDevices(): Promise<SmartThingsDevice[]> {
    const { data } = await this.client.get("/devices");

    return data.items;
  }

  /**
   * Obtém o status completo de um dispositivo.
   */
  public async getDeviceStatus(deviceId: string) {
    const { data } = await this.client.get(`/devices/${deviceId}/status`);

    return data;
  }

  /**
   * Executa um comando.
   */
  public async executeCommand(
    deviceId: string,
    capability: string,
    command: string,
    arguments_: unknown[] = [],
  ) {
    const body = {
      commands: [
        {
          component: "main",
          capability,
          command,
          arguments: arguments_,
        },
      ],
    };

    return this.client.post(`/devices/${deviceId}/commands`, body);
  }
}
