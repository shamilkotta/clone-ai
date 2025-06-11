import express from "express";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const router = express.Router();
const port = process.env.PORT || 5000;

const init = () => {
  app.get("/", (req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api", router);

  app.use(errorHandler);
  app.listen(port, () => {
    console.log(`Api running on port ${port}`);
  });
};

init();
