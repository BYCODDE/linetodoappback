import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

export async function handleAllTasks(req, res) {
  const db = await getDB();
  const taskCollection = db.collection("tasks");

  if (req.method === "GET" && req.url === "/tasks") {
    const allTasks = await taskCollection.find().toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: allTasks }));
  } else if (req.method === "POST" && req.url === "/tasks") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const newTask = JSON.parse(body);
      const result = await taskCollection.insertOne(newTask);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "successful inserted!",
          id: result.insertedId,
        })
      );
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/tasks/")) {
    const id = req.url.split("/")[2];
    const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "failed to  delete!" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "successfully deleted!" }));
    }
  } else if (req.method.startsWith("PATCH") && req.url.startsWith("/tasks/")) {
    const taskId = req.url.split("/")[2];

    if (!ObjectId.isValid(taskId)) {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Invalid Task  ID" }));
      return;
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const updates = JSON.parse(body);
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: updates }
      );

      if (result.matchedCount === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Task not found!" }));
        return;
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Task successfully   updated!" }));
      }
    });
  }
}
