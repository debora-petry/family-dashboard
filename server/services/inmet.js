import axios from "axios";

let cache = null;
let cacheTime = 0;

const CACHE_TIME = 5 * 60 * 1000;

export async function getInmetAlerts() {
  try {
    if (cache && Date.now() - cacheTime < CACHE_TIME) {
      return cache;
    }

    const { data } = await axios.get(
      "https://apiprevmet3.inmet.gov.br/avisos/ativos",
      {
        timeout: 10000,
      },
    );

    // Validate response structure
    if (!data || typeof data !== "object") {
      console.warn("Invalid INMET response structure");
      return cache || { hoje: [], futuro: [] };
    }

    cache = data;
    cacheTime = Date.now();

    return data;
  } catch (error) {
    console.error("Error fetching INMET alerts:", error.message);
    // Return cached data if available, otherwise empty response
    return cache || { hoje: [], futuro: [] };
  }
}
