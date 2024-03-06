import express from "express";
import { authRouter } from "./auth/auth-user.js";
import { userRouter } from "./apps/user/user.js";
import { bookRouter } from "./apps/book/book.js";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

export { app };
