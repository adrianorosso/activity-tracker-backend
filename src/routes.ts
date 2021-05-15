import express from "express";

export const createRoutes = () => {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  app.use("/", (_, res) => {
    res.send("OK");
  });

  app.listen(PORT, () => {
    console.log(`>>> Server listening to port: ${PORT}`);
  });
};
