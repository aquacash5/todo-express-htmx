import fs from "node:fs";
import path from "node:path";

export class JsonStore {
  constructor(storePath) {
    this.storePath = storePath;
  }

  static initialize(storePath) {
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    return new JsonStore(storePath);
  }

  read(defaultData) {
    try {
      return JSON.parse(fs.readFileSync(this.storePath, "utf8"));
    } catch {
      return defaultData;
    }
  }

  async write(data) {
    await fs.promises.writeFile(this.storePath, JSON.stringify(data, null, 2));
  }
}
