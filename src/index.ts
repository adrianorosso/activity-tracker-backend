import express from "express";
import "reflect-metadata";

const PORT = 3000;

const app = express();
app.use(express.json());

app.use("/", (_, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`>>> Server listening to port: ${PORT}`);
});
