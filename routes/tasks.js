import { getDB } from "../db/db.js";

export async function handleAllTasks(req, res) {
  const db = await getDB();
  const taskCollection = db.collection("tasks");

  if (req.method === "GET" && req.url === "/tasks") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "All tasks" }));
  } else if (req.method === "POST" && req.url === "/tasks") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    

    req.on("end", async () => {
      const newTask = JSON.parse(body);
      const result = await taskCollection.insertOne(newTask);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "successful inserted!" ,id:result.insertedId}));
    });


  }
}
