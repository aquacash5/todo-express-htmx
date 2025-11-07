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

  async read(defaultData) {
    try {
      return JSON.parse(await fs.readFile(this.storePath, "utf8"));
    } catch {
      return defaultData;
    }
  }

  async write(data) {
    await fs.writeFile(this.storePath, JSON.stringify(data, null, 2));
  }
}
