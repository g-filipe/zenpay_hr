import { employeeRouter } from "./employees.routes.js";
import { mongoConfig } from "./mongoConfig.js";
import express from "express";

await mongoConfig();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(employeeRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

