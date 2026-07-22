export function getEventIcon(summary: string) {
  const normalizedText = summary
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  if (
    normalizedText.includes("beach") ||
    normalizedText.includes("bt") ||
    normalizedText.includes("play")
  )
    return "bt";

  if (normalizedText.includes("academia") || normalizedText.includes("acad"))
    return "gym";

  if (normalizedText.includes("shopping") || normalizedText.includes("super"))
    return "compras";

  if (normalizedText.includes("feira")) return "feira";

  if (normalizedText.includes("gym")) return "gymJulia";

  if (
    normalizedText.includes("consulta") ||
    normalizedText.includes("exame") ||
    normalizedText.includes("hcpa") ||
    normalizedText.includes("plantao") ||
    normalizedText.includes("tele")
  )
    return "doctor";

  if (normalizedText.includes("aniver") || normalizedText.includes("niver"))
    return "birthday";

  if (normalizedText.includes("viagem")) return "trip";

  if (normalizedText.includes("festa")) return "party";

  if (
    normalizedText.includes("obra") ||
    normalizedText.includes("eng") ||
    normalizedText.includes("reforma")
  )
    return "obra";

  if (normalizedText.includes("psico") || normalizedText.includes("mentoria"))
    return "psico";

  if (normalizedText.includes("ferias")) return "ferias";

  if (normalizedText.includes("dentista")) return "dentista";

  if (
    normalizedText.includes("massagem") ||
    normalizedText.includes("drenagem")
  )
    return "spa";
  if (normalizedText.includes("escola")) return "escola";

  if (
    normalizedText.includes("copa") ||
    normalizedText.includes("jogo") ||
    normalizedText.includes("gremio") ||
    normalizedText.includes("inter")
  )
    return "bola";

  if (normalizedText.includes("janta") || normalizedText.includes("almoço"))
    return "comida";

  if (
    normalizedText.includes("gat") ||
    normalizedText.includes("vet") ||
    normalizedText.includes("lola") ||
    normalizedText.includes("bisnaguinha") ||
    normalizedText.includes("potes")
  )
    return "pet";

  return undefined;
}
