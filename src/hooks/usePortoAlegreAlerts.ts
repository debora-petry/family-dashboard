import { useEffect, useState } from "react";
import { getInmetAlerts } from "../services/inmet";
import type { InmetAlert, InmetResponse } from "../types/inmet";

export function usePortoAlegreAlerts() {
  const [alerts, setAlerts] = useState<InmetAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInmetAlerts();

        // Filtra alertas que afetam Porto Alegre (RS)
        const portoAlegreAlerts = filterPortoAlegreAlerts(data);
        setAlerts(portoAlegreAlerts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    load();

    const interval = setInterval(load, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  return {
    alerts,
    loading,
    error,
  };
}

function filterPortoAlegreAlerts(data: InmetResponse): InmetAlert[] {
  const allAlerts = [...(data.hoje || []), ...(data.futuro || [])];

  return allAlerts.filter((alert) => {
    // Filtra APENAS alertas que afetam Porto Alegre (RS)
    // municipios é uma string
    const municipiosStr = alert.municipios || "";

    const lowerMunicipios = municipiosStr.toLowerCase();

    // Checa se contém "porto alegre" mas EXCLUI as outras cidades
    if (lowerMunicipios.includes("porto alegre")) {
      // Exclui Porto Alegre do Norte e Porto Alegre do Tocantins
      if (
        lowerMunicipios.includes("do norte") ||
        lowerMunicipios.includes("do tocantins")
      ) {
        return false;
      }
      return true;
    }

    return false;
  });
}
