import express from "express";
import { Connection, getConnection, getRepository } from "typeorm";
import { Activity } from "./entity/activity";
import { IActivity } from "./interface/activity";
import cors from "cors";

// TODO: error handling
// TODO: change all to query builder
export const createRoutes = (dbConnection: Connection) => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const PORT = 4000;

  app.get("/activity", async (_, res) => {
    const activities = await dbConnection.getRepository(Activity).find();
    res.send({ activities: activities });
  });

  app.post("/activity", async (req, res) => {
    const newActivity = new Activity();
    const { name, description } = req.body as IActivity;

    newActivity.name = name;
    newActivity.description = description;
    newActivity.creationDate = new Date().toISOString();

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

    res.send({ updated: updated });
  });

  app.delete("/activity/:id", async (req, res) => {
    const repo = await dbConnection.getRepository(Activity);
    const element = await repo.findOne(req.params.id);
    if (element) {
      const removed = await repo.remove(element);
      res.send({ removed: removed });
    }
  });

  app.get("activity-item", async (req, res) => {
    res.send("List activity items");
  });

  app.get("activity-item/:id", (req, res) => {
    res.send("Get specific activity item");
  });

  app.post("activity-item", (req, res) => {
    res.send("Create new activity item");
  });

  app.put("activity-item/:id", (req, res) => {
    res.send("Update specific activity item");
  });

  app.delete("activity-item/:id", (req, res) => {
    res.send("Delete new activity item");
  });

  app.use((_, res) => {
    res.sendStatus(404).send("address not found");
  });

  app.listen(PORT, () => {
    console.log(`>>> Server listening to port: ${PORT}`);
  });
};
