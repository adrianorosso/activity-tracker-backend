import "reflect-metadata";
import { createConnection } from "typeorm";
import { createRoutes } from "./routes";

const main = async () => {
  let connection;

  try {
    connection = await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "activities_db",
      entities: [__dirname + "/entity/*.js"],
      logging: true,
      synchronize: true,
    });
  } catch (error) {
    console.log(error);
    throw Error("connection failed");
  }

  createRoutes(connection);
};

main();
