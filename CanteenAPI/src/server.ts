import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { getDbPool } from "./config/dbconfig";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import globalRoute from "./globalRoute";
import { initSocket } from "./socket";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// DEBUG
app.use((req, _res, next) => {
  
  next();
});

/* -------------------- ROUTES -------------------- */

app.get("/health", (_req: Request, res: Response) => {
  console.log("hey")
  res.send("Server is healthy");
});
app.use("/api", globalRoute);

//SWAGGER ROUTE/
app.use("/apiDocs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const server = http.createServer(app);
initSocket(server);


//  SERVER START 
async function startServer() {
  try {
    await getDbPool();
    server.listen(PORT, () => {
      console.log(`🚀 Server + DB + Socket.IO`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database ", error);
    process.exit(1);
  }
}

startServer();
