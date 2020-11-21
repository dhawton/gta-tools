const mysql = require("mysql2");
const fs = require("fs");

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "secret12345",
  database: "spcrp"
});

async function process() {
  console.log("Creating tables");
  await connection.execute("DROP TABLE IF EXISTS `import_vehicles`");
  await connection.execute("DROP TABLE IF EXISTS `import_orders`");
  await connection.execute("CREATE TABLE `import_vehicles` (`id` int(12) UNSIGNED NOT NULL,`name` varchar(255) NOT NULL,`model` varchar(255) NOT NULL,`price` int(7) NOT NULL,`category` varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
  await connection.execute("ALTER TABLE `import_vehicles` ADD PRIMARY KEY (`id`);");
  await connection.execute("ALTER TABLE `import_vehicles` MODIFY `id` int(12) UNSIGNED NOT NULL AUTO_INCREMENT;");
  await connection.execute("CREATE TABLE `import_orders` (`id` int(12) UNSIGNED NOT NULL,`identifier` varchar(255) NOT NULL,`delivery` DATE NOT NULL,`phone` varchar(8) NOT NULL,`model` varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
  await connection.execute("ALTER TABLE `import_orders` ADD PRIMARY KEY (`id`);");
  await connection.execute("ALTER TABLE `import_orders` MODIFY `id` int(12) UNSIGNED NOT NULL AUTO_INCREMENT;");
  
  const query = "INSERT INTO `import_vehicles`(`name`,`model`,`price`,`category`) VALUES(?,?,?,?)";
  const data = fs.readFileSync("output-final.json");
  const vehicles = JSON.parse(data);
  for (const i in vehicles) {
    await connection.execute(query, [
      vehicles[i].name,
      vehicles[i].model,
      vehicles[i].price,
      vehicles[i].category
    ]);
  };

  console.log("Done");
}

process();