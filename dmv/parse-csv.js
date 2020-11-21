const fs = require("fs");
const path = require("path");
const csvparse = require("csv-parse");

const parser = csvparse((err, records) => {
  records.map(record => {
    const data = `
    {
      Pos = {x = ${record[0]}, y = ${record[1]}, z = ${record[3]}},
      Action = function(playerPed, vehicle, setCurrentZoneType)
        DrawMissionText(_U('go_next_point'), 5000)
      end
    },
    `;
    fs.appendFileSync("output.lua", data);
  });
});

fs.createReadStream(path.resolve(__dirname, "points.csv")).pipe(parser);