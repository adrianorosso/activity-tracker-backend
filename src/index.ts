import "reflect-metadata";
import { createConnection } from "typeorm";
import { Activity } from "./entity/activity";
import { ActivityItem } from "./entity/activity-item";
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

    // await connection.getRepository(ActivityItem).delete({});
    // await connection.getRepository(Activity).delete({});
  } catch (error) {
    console.log(error);
    throw Error("connection failed");
  }

  createRoutes(connection);
};

main();
