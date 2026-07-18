import { useEffect, useState } from "react";
import { getInmetAlerts } from "../services/inmet";
import type { InmetResponse } from "../types/inmet";

export function useInmetAlerts() {
  const [alerts, setAlerts] = useState<InmetResponse | null>(null);
  const [inmetLoading, setLoading] = useState(true);
  const [inmetError, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInmetAlerts();
        setAlerts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    load();

    const interval = setInterval(load, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    alerts,
    inmetLoading,
    inmetError,
  };
}
