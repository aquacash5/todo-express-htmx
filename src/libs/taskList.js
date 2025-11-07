import { EventEmitter } from "node:events";

export class TaskList extends EventEmitter {
  constructor(tasks) {
    super();
    this.taskList = tasks;
    this.nextId =
      this.taskList.reduce((maxId, task) => Math.max(task.id, maxId), 0) + 1;
  }

  getTasks() {
    return this.taskList;
  }

  getTask(id) {
    return this.taskList.find((task) => task.id === id);
  }

  addTask(description) {
    const newTask = { id: this.nextId, description, completed: false };
    this.taskList.push(newTask);
    this.nextId += 1;
    this.emit("update", this.taskList);
    return newTask;
  }

  completeTask(taskId) {
    this.taskList = this.taskList.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      } else {
        return task;
      }
    });
    this.emit("update", this.taskList);
  }

  uncompleteTask(taskId) {
    this.taskList = this.taskList.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: false };
      } else {
        return task;
      }
    });
    this.emit("update", this.taskList);
  }

  removeTask(taskId) {
    this.taskList = this.taskList.filter((task) => task.id !== taskId);
    this.emit("update", this.taskList);
  }

  removeCompletedTasks() {
    this.taskList = this.taskList.filter((task) => !task.completed);
    this.emit("update", this.taskList);
  }
}
