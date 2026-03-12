import express, { Request, Response } from "express";
import "express-async-errors";
import { routes } from "./routes";
import { errorhadling } from "./middlewares/error-handling";

const app = express();

app.use(express.json());

app.use(routes);

app.use(errorhadling);

app.get("/", (request: Request, response: Response) => {
  response.send({ message: "Server is running" });
});

export { app };
