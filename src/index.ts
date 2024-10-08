import { employeeRouter } from "@routes/employees.js";
import { mongoConfig } from "./mongoConfig.js";
import express from "express";
import { userRouter } from "@routes/user.js";
import { loginRouter } from "@routes/login.js";

await mongoConfig();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(employeeRouter);
app.use(userRouter);
app.use(loginRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
