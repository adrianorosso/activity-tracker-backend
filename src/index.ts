import "reflect-metadata";
// import { createConnection } from "typeorm";
import { createRoutes } from "./routes";

const main = () => {
  // createConnection({
  //   type: "postgres",
  //   host: "localhost",
  //   port: 5432,
  //   username: "postgres",
  //   password: "postgres",
  //   database: "activities_db",
  //   entities: [__dirname + "/entity/*.js"],
  //   logging: true,
  //   synchronize: true,
  // })
  //   .then((connection) => {
  //     // here you can start to work with your entities
  //     console.log("Creating tables");
  //   })
  //   .catch((error) => console.log(error));

  createRoutes();
};

main();
