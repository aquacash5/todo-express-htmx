import fs from "node:fs";
import path from "node:path";

export function errorResponse(err, res, status = 500) {
  res.status(status).send(err.message);
}

export function packageRoot(start) {
  let cur = start || path.resolve(".");

  while (cur !== path.dirname(cur)) {
    try {
      fs.accessSync(path.join(cur, "package.json"));
      return cur;
    } catch {
      cur = path.dirname(cur);
    }
  }

  throw new Error("Could not find root of package");
}
