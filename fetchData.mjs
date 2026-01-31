// scripts/fetchData.mjs
import fs from "fs";
import process from "process";

const url = `https://skins-table.com/api_v2/items?apikey=8R4voOJHFLcxte3GhBMNKjSmkpQRO7k8bsR6TypaOS5O-cKdzK&app=730&site=STEAM`;

async function saveData() {
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
    const data = await response.json();
    const transformed = { items: {} };
    for (const [name, values] of Object.entries(data.items || {})) {
      const price = values.p;
      const stock = values.c;
      if (typeof stock === "number" && stock >= 1) {
        transformed.items[name] = {
          price: price,
          stock: stock,
        };
      }
    }
    fs.writeFileSync("floatPriceList.json", JSON.stringify(transformed, null, 2), "utf-8");
    console.log("Dane zapisane do floatPriceList.json");
  } catch (err) {
    console.error("Błąd pobierania danych:", err?.message ?? err);
    process.exit(2);
  }
}
saveData();
