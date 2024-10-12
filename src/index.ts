import { employeeRouter } from "@routes/employees.js";
import { mongoConfig } from "./mongoConfig.js";
import express from "express";
import { userRouter } from "@routes/users.js";
import { loginRouter } from "@routes/login.js";
import { benefitRouter } from "@routes/benefits.js";

await mongoConfig();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(employeeRouter);
app.use(userRouter);
app.use(loginRouter);
app.use(benefitRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
