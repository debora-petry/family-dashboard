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
    // Verifica se Porto Alegre está listado nos municípios
    if (alert.municipios && alert.municipios.includes("Porto Alegre")) {
      return true;
    }

    // Verifica se está no estado RS
    if (alert.estados && alert.estados.includes("RS")) {
      return true;
    }

    // Verifica se está na região (sul do Brasil)
    if (alert.regioes && alert.regioes.includes("Sul")) {
      // Melhor ter certeza: verifica se tem RS no estados também
      if (alert.estados && alert.estados.includes("RS")) {
        return true;
      }
    }

    return false;
  });
}
