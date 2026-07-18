import mqtt from "mqtt";

const client = mqtt.connect({
  protocol: "mqtts",
  host: "globalbroker.inmet.gov.br",
  port: 8883,
  username: "everyone",
  password: "everyone",
  rejectUnauthorized: false,
});

client.on("connect", () => {
  console.log("✅ Conectado!");

  client.subscribe(
    "cache/a/wis2/br-inmet/data/core/weather/advisories-warnings",
    (err, granted) => {
      if (err) {
        console.error("❌ Erro no subscribe:", err);
      } else {
        console.log("✅ Subscribe OK");
        console.log(granted);
      }
    },
  );
});

client.on("message", (topic, message) => {
  console.log("\n======================");
  console.log("TOPIC:", topic);
  console.log(message.toString());
  console.log("======================\n");
});

client.on("error", (err) => {
  console.error("MQTT ERROR:", err);
});

client.on("error", (err) => {
  console.error("❌ ERRO:", err);
});

client.on("close", () => {
  console.log("🔒 Conexão fechada");
});

client.on("offline", () => {
  console.log("📴 Offline");
});

client.on("reconnect", () => {
  console.log("🔄 Reconectando...");
});
