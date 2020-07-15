import { body, query } from "express-validator";

import * as regexes from "../../../shared/utils/regexes";

const usersRules = () => {
  return [
    body("name").isString().not().isEmpty(),
    body("cpf").isString().matches(regexes.CPF, "i"),
    body("password").isString().not().isEmpty(),
  ];
};

const usersPatchRules = () => {
  return [
    body("name").isString().optional(),
    body("cpf").isString().matches(regexes.CPF, "i").optional(),
    body("password").isString().optional(),
  ];
};

export { usersRules, usersPatchRules };
