import express from "express";
import cors from "cors";
import mediaRouter from "./services/media/media.js";
// import reviewRouter from "./services/review/review.js";

import listEndpoints from "express-list-endpoints";
const server = express();

const port = process.env.PORT;

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, next) => {
    if (!origin || whiteList.includes(origin)) {
      next(null, true);
    } else {
      next(new Error(`Origin ${origin} not allowed!`));
    }
  },
};

server.use(express.json());
server.use(cors(corsOpts));
console.table(listEndpoints(server));

// Router

server.use("/media", mediaRouter);
// server.use("/media", reviewRouter);

server.listen(port, () => {
  console.log(" Server running");
});
