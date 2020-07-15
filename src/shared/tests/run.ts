import faker from "faker";
faker.locale = process.env.API_LOCALE || "pt_BR";

export const runSetup = async () => {
  process.env.TEST_RUNNING = "running";

  console.log("-> faker.locale:", faker.locale);
};
