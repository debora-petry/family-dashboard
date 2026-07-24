import type { InmetResponse } from "../types/inmet";

export async function getInmetAlerts(): Promise<InmetResponse> {
  const API_URL =
    import.meta.env.VITE_API_URL || "https://family-dashboard-api.onrender.com";

  const response = await fetch(`${API_URL}/weather/inmet-alerts`);

  if (!response.ok) {
    throw new Error("Erro ao buscar alertas do INMET");
  }

  return response.json();
}
