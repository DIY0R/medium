import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import router from "./routes/index";
import { myDataSource } from "./db/db";
import errorHandler from "./middlewares/ErrorHandlingMiddleware";
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await myDataSource.initialize();
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    app.use("/api", router);
    app.use(errorHandler);
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("ERROR", error);
  }
};
start();
