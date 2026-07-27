import axios, { AxiosInstance } from "axios";

export class SmartThingsFindClient {
  private client: AxiosInstance;
  private csrf?: string;

  constructor(private readonly jsessionId: string) {
    this.client = axios.create({
      baseURL: "https://smartthingsfind.samsung.com",
      timeout: 10000,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        Cookie: `JSESSIONID=${jsessionId}`,
        "User-Agent": "FamilyDashboard/1.0",
      },
    });

    // Adiciona automaticamente o CSRF em todas as requisições,
    // depois que ele for obtido no authenticate().
    this.client.interceptors.request.use((config) => {
      if (this.csrf) {
        config.params = {
          ...config.params,
          _csrf: this.csrf,
        };
      }

      return config;
    });
  }
}
