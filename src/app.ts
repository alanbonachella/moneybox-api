import express from "express";
import bodyParser from "body-parser";
import timeout from "connect-timeout";
import helmet from "helmet";
import routes from "./routes";
import { ServicesCollection } from "./shared/services/setup";
import passport from "passport";
import catchError from "./shared/utils/catch-error";
import { strategy } from "./shared/utils/authenticate";

const server = (servicesCollection: ServicesCollection) => {
  const app = express();

  passport.use(strategy);

  app.use(bodyParser.json());

  app.use(helmet());
  app.use(passport.initialize());
  app.use(timeout("30s"));
  app.use(express.json());
  app.use(routes.map((router) => router(servicesCollection)));
  app.use(catchError);

  return app;
};

export default server;
