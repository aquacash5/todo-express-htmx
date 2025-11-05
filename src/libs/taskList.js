import { EventEmitter } from "node:events";

export class TaskList extends EventEmitter {
  constructor(tasks) {
    super();
    this.todoList = tasks;
    this.nextId =
      this.todoList.reduce((maxId, task) => Math.max(task.id, maxId), 0) + 1;
  }

  getTasks() {
    return this.todoList;
  }

  addTask(description) {
    this.todoList.push({ id: this.nextId, description, completed: false });
    this.nextId += 1;
    this.emit("update", this.todoList);
  }

  completeTask(taskId) {
    this.todoList = this.todoList.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      } else {
        return task;
      }
    });
    this.emit("update", this.todoList);
  }

  uncompleteTask(taskId) {
    this.todoList = this.todoList.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: false };
      } else {
        return task;
      }
    });
    this.emit("update", this.todoList);
  }

  removeTask(taskId) {
    this.todoList = this.todoList.filter((task) => task.id !== taskId);
    this.emit("update", this.todoList);
  }

  removeCompletedTasks() {
    this.todoList = this.todoList.filter((task) => !task.completed);
    this.emit("update", this.todoList);
  }
}
