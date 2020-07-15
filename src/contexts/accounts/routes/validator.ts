import { body } from "express-validator";

const accountRules = () => {
  return [body("value").isNumeric().not().isEmpty()];
};

export { accountRules };
