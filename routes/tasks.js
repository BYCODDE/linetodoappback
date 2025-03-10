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
      res.end(JSON.stringify({ message: "successful deleted!" }));
    }
  }
}
