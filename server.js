import http from "http";
import dotenv from "dotenv";
import { handleAllTasks } from "./routes/tasks.js";
import { connectDB } from "./db/db.js";

dotenv.config();
  const PORT = process.env.PORT || 3001;

async function serverStart() {
  await connectDB();
  const server = http.createServer((req, res) => {
    handleAllTasks(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

serverStart().catch((err) => console.error("Error starting server", err));