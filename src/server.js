import express from "express";
import cors from "cors";
import mediaRouter from "./services/media.js";

import listEndpoints from "express-list-endpoints";
const server = express();

const port = process.env.PORT;

server.use(express.json());
server.use(cors());
console.table(listEndpoints(server));

// Router

server.use("/media", mediaRouter);

server.listen(port, () => {
  console.log(" Server running");
});
