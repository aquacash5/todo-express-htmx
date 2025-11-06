import bodyParser from "body-parser";
import express from "express";
import hbs from "hbs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JsonStore } from "./libs/jsonStore.js";
import { TaskList } from "./libs/taskList.js";
import { errorResponse } from "./libs/utils.js";

const HTTP_PORT = process.env.TODO_PORT || 3000;
const BASE_DIR = path.dirname(fileURLToPath(import.meta.url));

console.log("loading json store...");
const todosStore = await JsonStore.initialize(
  path.join(BASE_DIR, "data", "todos.json")
);
const taskList = new TaskList(await todosStore.read());
taskList.on("update", async (todos) => await todosStore.write(todos));
console.log();

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(BASE_DIR, "views"));
hbs.registerPartials(
  path.join(BASE_DIR, "views", "partials"),
  function (err) {}
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/static", express.static(path.join(BASE_DIR, "static")));

app.get("/", (_req, res) => {
  res.redirect("/tasks");
});

app.get("/tasks", (_req, res) => {
  res.render("todos", { todos: taskList.getTasks() });
});

app.post("/tasks", (req, res) => {
  try {
    taskList.addTask(req.body.description);
  } catch (err) {
    return errorResponse(err, res);
  }
  res.render("todos", { todos: taskList.getTasks() });
});

app.post("/tasks/:taskId/complete", (req, res) => {
  try {
    if (!/\d+/.test(req.params.taskId))
      throw new Error("Task Id must be a number.");

    const taskId = Number.parseInt(req.params.taskId, 10);
    taskList.completeTask(taskId);
  } catch (err) {
    return errorResponse(err, res);
  }
  res.redirect("/tasks");
});

app.post("/tasks/:taskId/uncomplete", (req, res) => {
  try {
    if (!/\d+/.test(req.params.taskId))
      throw new Error("Task Id must be a number.");

    const taskId = Number.parseInt(req.params.taskId, 10);
    taskList.uncompleteTask(taskId);
  } catch (err) {
    return errorResponse(err, res);
  }
  res.redirect("/tasks");
});

app.delete("/tasks/completed", (_req, res) => {
  try {
    taskList.removeCompletedTasks();
  } catch (err) {
    return errorResponse(err, res);
  }
  res.redirect("/tasks");
});

app.delete("/tasks/:taskId", (req, res) => {
  try {
    if (!/\d+/.test(req.params.taskId))
      throw new Error("Task Id must be a number.");

    const taskId = Number.parseInt(req.params.taskId, 10);
    taskList.removeTask(taskId);
  } catch (err) {
    return errorResponse(err, res);
  }
  res.redirect("/tasks");
});

app.listen(HTTP_PORT, (err) => {
  if (err) {
    console.error("Could not start service:", err);
  } else {
    console.log(`Listening on http://127.0.0.1:${HTTP_PORT}`);
  }
});
