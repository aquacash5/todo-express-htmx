import { promises as fs } from "node:fs";
import path from "node:path";

export class JsonStore {
  constructor(storePath) {
    this.storePath = storePath;
  }

  static async initialize(storePath) {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    return new JsonStore(storePath);
  }

  async read() {
    return JSON.parse(await fs.readFile(this.storePath, "utf8"));
  }

  async write(data) {
    await fs.writeFile(this.storePath, JSON.stringify(data, null, 2));
  }
}
