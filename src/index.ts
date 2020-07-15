import serverBuilder from "./server-builder";
import { connectDb } from "./shared/db";

const up = async () => {
  const port = 8080;

  const db = connectDb();
  const app = await serverBuilder(db);

  app.listen(port, () => {
    console.log("Server is up on port " + port);
  });
};

(async () => await up())();
