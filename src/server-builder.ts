import server from "./app";
import { ServicesCollection, setupServices } from "./shared/services/setup";
import { connectDb } from "./shared/db";

export default async (dependencies: any = {}) => {
  const db = connectDb();

  const dependenciesDefault = setupServices(db);

  const deps: ServicesCollection = {
    db: dependencies.db || dependenciesDefault.db,
  };

  return server(deps);
};
