import express from "express";
import { Connection, getConnection, getRepository } from "typeorm";
import { Activity } from "./entity/activity";
import { IActivity } from "./interface/activity";
import cors from "cors";
import { ActivityItem } from "./entity/activity-item";
import convertMsToTime from "./utils/convert-ms-to-time";
import { getCurrentTime } from "./utils/get-current-time";

// TODO: error handling
// TODO: change all to query builder
export const createRoutes = (dbConnection: Connection) => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const PORT = 4000;

  // === Activity ===
  app.get("/activity", async (_, res) => {
    const activities = await dbConnection.getRepository(Activity).find();
    res.send({ activities: activities });
  });

  app.get("/activity/:id", async (req, res) => {
    const activity = await dbConnection
      .getRepository(Activity)
      .createQueryBuilder("act")
      .where("act.id = :id", { id: +req.params.id })
      .getOne();
    res.send({ activity });
  });

  app.post("/activity", async (req, res) => {
    const newActivity = new Activity();
    const { name, description } = req.body as IActivity;

    newActivity.name = name;
    newActivity.description = description;
    newActivity.creationDate = getCurrentTime();
    const saved = await newActivity.save();

    res.send({ created: saved });
  });

  app.put("/activity/:id", async (req, res) => {
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

    res.send({ updated });
  });

  app.delete("/activity/:id", async (req, res) => {
    const repo = await dbConnection.getRepository(Activity);
    const element = await repo.findOne(req.params.id);
    if (element) {
      const removed = await repo.remove(element);
      res.send({ removed });
    }
  });

  app.get("/activity-item", async (req, res) => {
    const items = await dbConnection.getRepository(ActivityItem).find();
    res.send({ items });
  });

  app.get("/activity-item/:id", async (req, res) => {
    const item = await dbConnection
      .getRepository(ActivityItem)
      .createQueryBuilder("item")
      .where("item.id = :id", { id: +req.params.id })
      .getOne();
    res.send({ item });
  });

  // === Activity Item ===
  app.post("/activity-item", async (req, res) => {
    const newActivityItem = new ActivityItem();
    newActivityItem.startTime = getCurrentTime();
    newActivityItem.activity = req.body.activity;

    const saved = await newActivityItem.save();

    res.send({ saved });
  });

  app.put("/activity-item/:id", async (req, res) => {
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
      .where("item.id = :id", { id })
      .getOne();

    res.send({ updated });
  });

  app.delete("/activity-item/:id", (req, res) => {
    // @TODO
    res.send("Delete new activity item");
  });

  app.use((_, res) => {
    res.sendStatus(404).send("address not found");
  });

  app.listen(PORT, () => {
    console.log(`>>> Server listening to port: ${PORT}`);
  });
};
