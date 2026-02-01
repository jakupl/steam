// scripts/fetchData.mjs
import fs from "fs";
import process from "process";

const API_KEY = "8R4voOJHFLcxte3GhBMNKjSmkpQRO7k8bsR6TypaOS5O-cKdzK";
const APP = "730";

const URL_STEAM = `https://skins-table.com/api_v2/items?apikey=${API_KEY}&app=${APP}&site=STEAM`;
const URL_ORDERS = `https://skins-table.com/api_v2/items?apikey=${API_KEY}&app=${APP}&site=STEAM%20ORDER`;

async function fetchItems(url) {
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Błąd HTTP dla ${url}: ${response.status}`);
  }
  const data = await response.json();
  return data.items || {};
}

async function saveData() {
  try {
    console.log("Pobieranie cen sprzedaży (STEAM)...");
    const itemsSell = await fetchItems(URL_STEAM);

    console.log("Pobieranie buy orderów (STEAM ORDER)...");
    const itemsOrder = await fetchItems(URL_ORDERS);

    const transformed = { items: {} };

    for (const [name, sellData] of Object.entries(itemsSell)) {
      const sellPrice = sellData.p;
      const stock = sellData.c;

      if (typeof stock !== "number" || stock < 1) {
        continue;
      }

      const orderData = itemsOrder[name] || {};
      const orderPrice = typeof orderData.p === "number" ? orderData.p : null;

      transformed.items[name] = {
        price: sellPrice,
        order_price: orderPrice,   
        stock: stock,
      };
    }



    fs.writeFileSync(
      "floatPriceList.json",
      JSON.stringify(transformed, null, 2),
      "utf-8"
    );

    console.log(`Zapisano ${Object.keys(transformed.items).length} skinów do floatPriceList.json`);
  } catch (err) {
    console.error("Błąd podczas pobierania/zapisywania danych:", err.message || err);
    process.exit(2);
  }
}

saveData();
