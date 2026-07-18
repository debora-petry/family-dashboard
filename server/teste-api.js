const response = await fetch("https://apiprevmet3.inmet.gov.br/avisos/ativos", {
  headers: {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
  },
});

console.log(response.status);

const text = await response.text();
console.log(text.substring(0, 500));
