import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import hbs from "hbs";
import hbsUtilities from "hbs-utils";
import path from "node:path";
import process from "node:process";

export function setupExpressApp(baseDir) {
  const hbsutils = hbsUtilities(hbs);
  const app = express();

  app.set("view engine", "hbs");
  app.set("views", path.join(baseDir, "views"));

  if (process.env.NODE_ENV === "production") {
    hbsutils.registerPartials(path.join(baseDir, "views", "partials"));
  } else {
    hbsutils.registerWatchedPartials(path.join(baseDir, "views", "partials"));
  }

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use("/static", express.static(path.join(baseDir, "static")));

  return app;
}
