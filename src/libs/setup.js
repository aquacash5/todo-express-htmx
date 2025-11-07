import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import hbs from "hbs";
import hbsutilities from "hbs-utils";
import { promises as fs } from "node:fs";
import path from "node:path";

export async function setupExpressApp(baseDir) {
  const cacheDir = path.join(baseDir, "cache");
  await fs.mkdir(cacheDir, { recursive: true });

  const hbsutils = hbsutilities(hbs);
  const app = express();

  app.set("view engine", "hbs");
  app.set("views", path.join(baseDir, "views"));
  hbsutils.registerWatchedPartials(
    path.join(baseDir, "views", "partials"),
    function (err) {}
  );

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use("/static", express.static(path.join(baseDir, "static")));

  return app;
}
