const fs = require("fs");
const axios = require("axios");
const path = require("path");

const BASE_URL="https://www.gtabase.com/";
const files = {};
const vehicles = [];

async function handle() {
  let data = fs.readFileSync("cars.json");
  const rawData = JSON.parse(data);
  Object.keys(rawData).forEach((key) => {
    const car = rawData[key];
    let models = [];
    if (car.attr.ct348.value.indexOf(",") > -1) {
      models = car.attr.ct348.value.split(", ");
      models.forEach((v) => {
        vehicles.push({
          model: v,
          name: car.name,
          price: (car.attr.ct13 !== undefined) ? car.attr.ct13.value / 10 : -1,
          category: car.attr.ct1.value[0].toLowerCase()
        });
        files[v] = `${BASE_URL}${car.thumbnail}`;
      });
    } else {
      vehicles.push({
        model: car.attr.ct348.value,
        name: car.name,
        price: (car.attr.ct13 !== undefined) ? car.attr.ct13.value / 10 : -1,
        category: car.attr.ct1.value[0].toLowerCase()
      });
      files[car.attr.ct348.value] = `${BASE_URL}${car.thumbnail}`
    }
  });
  let promises = Object.keys(files).map((key) => download(files[key], `${key}.jpg`));
  promises.push(writeJSON());
  return Promise.all(promises);
}

function writeJSON() {
  return new Promise((resolve, reject) => {
    fs.writeFile("output.json", JSON.stringify(vehicles), (err) => {
      if (err) {
        console.error(`Caught write file error: ${err}`)
        reject(err);
        return;
      }

      resolve(true);
    });
  });
}

function download(url, target) {
  return axios({
    method: "get",
    url,
    responseType: "stream"
  }).then((resp) => {
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(path.resolve(__dirname, "img", target));
      resp.data.pipe(writer);
      writer.on("error", (err) => {
        console.error(`Error writing to file ${target}`, err);
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        resolve(true);
      });
    })
  }).catch((err) => {
    console.error(err);
  });
}

handle().then(() => {
  console.log("Completed.");
}).catch((err) => {
  console.log("There were errors.", err);
});