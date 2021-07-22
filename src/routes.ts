import express from "express";
import { Connection, getConnection, getRepository } from "typeorm";
import { Activity } from "./entity/activity";
import { IActivity } from "./interface/activity";
import cors from "cors";
import { ActivityItem } from "./entity/activity-item";
import convertMsToTime from "./utils/convert-ms-to-time";
import { getCurrentTime } from "./utils/get-current-time";

export const createRoutes = (dbConnection: Connection) => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const PORT = 4000;

  // === Activity ===
  app.get("/activity", async (req: express.Request, res: express.Response) => {
    const activities = await dbConnection.getRepository(Activity).find();
    // In case the join is needed -> .find({ relations: ["items"] });
    res.send({ activities: activities });
  });

  app.get(
    "/activity/:id",
    async (req: express.Request, res: express.Response) => {
      const activity = await dbConnection
        .getRepository(Activity)
        .createQueryBuilder("act")
        .where("act.id = :id", { id: +req.params.id })
        .getOne();
      res.send({ activity });
    }
  );

  app.post("/activity", async (req: express.Request, res: express.Response) => {
    const newActivity = new Activity();
    const { name, description } = req.body as IActivity;

    newActivity.name = name;
    newActivity.description = description;
    newActivity.creationDate = getCurrentTime();
    const created = await newActivity.save();

    res.status(200).send({ created });
  });

  app.put(
    "/activity/:id",
    async (req: express.Request, res: express.Response) => {
      const { name, description } = req.body as IActivity;
      const id = req.params.id;

      await getConnection()
        .createQueryBuilder()
        .update(Activity)
        .set({ name: name, description: description })
        .where("id = :id", { id: id })
        .execute();

      const updated = await getRepository(Activity)
        .createQueryBuilder("act")
        .where("act.id = :id", { id: id })
        .getOne();

      res.status(200).send({ updated });
    }
  );

  app.delete(
    "/activity/:id",
    async (req: express.Request, res: express.Response) => {
      const repo = await dbConnection.getRepository(Activity);
      const element = await repo.findOne(req.params.id);
      // @TODO: work on deletion with foreign key
      if (element) {
        const removed = await repo.remove(element);
        res.status(200).send({ removed });
      }
    }
  );

  // === Activity Item ===
  app.get(
    "/activity-item",
    async (req: express.Request, res: express.Response) => {
      // NOTE: It is needed to indicate the "relations" when getting objects
      // Otherwise the join is not done
      const items = await dbConnection
        .getRepository(ActivityItem)
        .find({ relations: ["activity"], order: { startTime: "DESC" } });
      res.status(200).send({ items });
    }
  );

  app.get(
    "/activity-item/:id",
    async (req: express.Request, res: express.Response) => {
      const item = await dbConnection
        .getRepository(ActivityItem)
        .createQueryBuilder("item")
        .where("item.id = :id", { id: +req.params.id })
        .getOne();
      res.status(200).send({ item });
    }
  );

  app.post(
    "/activity-item",
    async (req: express.Request, res: express.Response) => {
      const newActivityItem = new ActivityItem();
      newActivityItem.startTime = getCurrentTime();
      newActivityItem.activity = req.body.activity;

      const saved = await newActivityItem.save();

      const created = await dbConnection
        .getRepository(ActivityItem)
        .findOne({ where: { id: saved.id }, relations: ["activity"] });

      res.status(200).send({ created });
    }
  );

  app.put(
    "/activity-item/:id",
    async (req: express.Request, res: express.Response) => {
      const id = +req.params.id;

      const current = await dbConnection
        .getRepository(ActivityItem)
        .createQueryBuilder("item")
        .where("item.id = :id", { id })
        .getOne();

      const end = getCurrentTime();
      const duration = convertMsToTime(
        Date.parse(end) - Date.parse(current!.startTime)
      );

      await dbConnection
        .createQueryBuilder()
        .update(ActivityItem)
        .set({ endTime: end, duration: duration })
        .where("id = :id", { id })
        .execute();

      const updated = await dbConnection
        .getRepository(ActivityItem)
        .createQueryBuilder("item")
        .leftJoinAndSelect("item.activity", "activity")
        .where("item.id = :id", { id })
        .getOne();

      res.status(200).send({ updated });
    }
  );

  app.delete("/activity-item/:id", (req, res) => {
    // @TODO
    res.send("Delete new activity item");
  });

  // If the address does not match any of the routes defined
  app.use((_, res) => {
    res.status(404).send("address not found");
  });

  // Generic Error Handler
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err.stack);
      res.status(500).send("Internal Server Error");
    }
  );

  app.listen(PORT, () => {
    console.log(`>>> Server listening to port: ${PORT}`);
  });
};
