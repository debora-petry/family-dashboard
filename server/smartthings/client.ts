import axios, { AxiosInstance } from "axios";

export class SmartThingsFindClient {
  private client: AxiosInstance;

  private csrf?: string;

  constructor(private readonly jsessionId: string) {
    this.client = axios.create({
      baseURL: "https://smartthingsfind.samsung.com",

      headers: {
        Cookie: `JSESSIONID=${jsessionId}`,

        Accept: "application/json",
      },

      withCredentials: true,
    });
  }
}
