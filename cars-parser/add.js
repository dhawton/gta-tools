const fs = require("fs");
const path = require("path");
const prompt = require('prompt-sync')();
const data = fs.readFileSync("output.json");
const vehicles = JSON.parse(data);
const missingVehicles = [];

const models = [];
Object.keys(vehicles).map((veh) => models.push(vehicles[veh].model));

const dir = fs.readdirSync(path.resolve(__dirname, "resized-img"));
for (const idx in dir) {
  const file = dir[idx];
  if (fs.lstatSync(path.resolve(__dirname, "resized-img", file)).isFile()) {
    if (!models.includes(file.replace(".jpg",""))) {
      missingVehicles.push(file.replace(".jpg",""));
    }
  }
}

console.log(`Missing models: ${JSON.stringify(missingVehicles)}`);

for (const veh in missingVehicles) {
  console.log(`For ${missingVehicles[veh]}`)
  const name = prompt("Vehicle name: ");
  const price = prompt("Price: ");
  const category = prompt("Category: ");
  vehicles.push({
    model: missingVehicles[veh],
    name: name,
    price: parseInt(price),
    category: category
  });
}

console.log("Writing new JSON object...");
fs.writeFileSync("output-final.json", JSON.stringify(vehicles));
console.log("Completed.");
