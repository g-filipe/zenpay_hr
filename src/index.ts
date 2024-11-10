import { employeeRouter } from "@routes/employees.js";
// import { mongoConfig } from "./mongoConfig.js";
import express from "express";
import { userRouter } from "@routes/users.js";
import { loginRouter } from "@routes/login.js";
import { workdaysRouter as workdaysRouter } from "@routes/workdays.js";
import { departmentRouter } from "@routes/department.js";

// await mongoConfig();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(workdaysRouter);
app.use(employeeRouter);
app.use(userRouter);
app.use(loginRouter);
app.use(departmentRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
