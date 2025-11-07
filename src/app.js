import path from "node:path";
import { fileURLToPath } from "node:url";
import { JsonStore } from "./libs/jsonStore.js";
import { setupExpressApp } from "./libs/setup.js";
import { TaskList } from "./libs/taskList.js";
import { errorResponse, packageRoot } from "./libs/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTTP_PORT = process.env.TODO_PORT || 3000;

const DATA_DIR =
  process.env.DATA_DIR || path.join(packageRoot(__dirname), "temp", "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

console.log("loading json store:", DATA_FILE);
const tasksStore = JsonStore.initialize(DATA_FILE);
const taskList = new TaskList(tasksStore.read([]));
taskList.on("update", async (tasks) => await tasksStore.write(tasks));

const app = setupExpressApp(__dirname);

app.get("/", (_req, res) => {
  res.redirect("/tasks");
});

app.get("/health-check", (_req, res) => {
  res.send("OK");
});

app.get("/tasks", (_req, res) => {
  res.render("tasks", { tasks: taskList.getTasks() });
});

app.post("/tasks", (req, res) => {
  try {
    const task = taskList.addTask(req.body.description);
    res.render("partials/task", { task });
  } catch (err) {
    errorResponse(err, res);
  }
});

app.post("/tasks/:taskId/complete", (req, res) => {
  try {
    if (!/\d+/.test(req.params.taskId))
      throw new Error("Task Id must be a number.");

    const taskId = Number.parseInt(req.params.taskId, 10);
    taskList.completeTask(taskId);
    res.render("partials/task", { task: taskList.getTask(taskId) });
  } catch (err) {
    errorResponse(err, res);
  }
});

app.post("/tasks/:taskId/uncomplete", (req, res) => {
  try {
    if (!/\d+/.test(req.params.taskId))
      throw new Error("Task Id must be a number.");

    const taskId = Number.parseInt(req.params.taskId, 10);
    taskList.uncompleteTask(taskId);
    res.render("partials/task", { task: taskList.getTask(taskId) });
  } catch (err) {
    errorResponse(err, res);
  }
});

app.delete("/tasks/completed", (_req, res) => {
  try {
    taskList.removeCompletedTasks();
    res.render("tasks", { tasks: taskList.getTasks() });
  } catch (err) {
    errorResponse(err, res);
  }
});

app.delete("/tasks/:taskId", (req, res) => {
  try {
    if (!/\d+/.test(req.params.taskId))
      throw new Error("Task Id must be a number.");

    const taskId = Number.parseInt(req.params.taskId, 10);
    taskList.removeTask(taskId);
    res.send(`Deleted task ${taskId}`);
  } catch (err) {
    errorResponse(err, res);
  }
});

const server = app.listen(HTTP_PORT, (err) => {
  if (err) {
    console.error("Could not start service:", err);
  } else {
    console.log(`Listening on http://127.0.0.1:${HTTP_PORT}`);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received");
  console.log("Closing HTTP server");

  server.close((err) => {
    if (err) {
      console.error("HTTP server could not be cleanly closed:", err);
      console.log("Force closing process");
      process.exit(1);
    } else {
      console.log("HTTP server closed");
      console.log("Exiting process");
      process.exit(0);
    }
  });
});
