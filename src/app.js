import path from "node:path";
import { fileURLToPath } from "node:url";
import { JsonStore } from "./libs/jsonStore.js";
import { setupExpressApp } from "./libs/setup.js";
import { TaskList } from "./libs/taskList.js";
import { errorResponse } from "./libs/utils.js";

const HTTP_PORT = process.env.TODO_PORT || 3000;
const BASE_DIR = path.dirname(fileURLToPath(import.meta.url));

console.log("loading json store...");
const tasksStore = await JsonStore.initialize(
  path.join(BASE_DIR, "data", "tasks.json")
);
const taskList = new TaskList(await tasksStore.read([]));
taskList.on("update", async (tasks) => await tasksStore.write(tasks));
console.log();

const app = await setupExpressApp(BASE_DIR);

app.get("/", (_req, res) => {
  res.redirect("/tasks");
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
    res.send(`Delted task ${taskId}`);
  } catch (err) {
    errorResponse(err, res);
  }
});

app.listen(HTTP_PORT, (err) => {
  if (err) {
    console.error("Could not start service:", err);
  } else {
    console.log(`Listening on http://127.0.0.1:${HTTP_PORT}`);
  }
});
