
export const handleAllTasks = (req, res) => {
  if(req.method === "GET" && req.url === "/tasks") {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({ message: "All tasks" }));
  }
  else if(req.method === "POST" && req.url === "/tasks") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      res.writeHead(201, {"Content-Type": "application/json"});
      res.end(JSON.stringify({ message: data }));
    })
  }
}