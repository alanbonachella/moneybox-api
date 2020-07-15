import { body, query } from "express-validator";

import * as regexes from "../../../shared/utils/regexes";

const accountDepositRules = () => {
  return [
    body("name").isString().not().isEmpty(),
    body("email").isEmail().not().isEmpty(),
    body("password")
      .isString()
      .matches(/^.{6,}$/, "i"),
    body("phone").isString().matches(regexes.phoneNumber, "i"),
    body("cpf").isString().matches(regexes.CPF, "i"),
    body("otherResponsible").isString().optional({ nullable: true }),
  ];
};

const accountWithdrawRules = () => {
  return [
    body("name").optional().isString().not().isEmpty(),
    body("email").optional().not().isEmpty(),
    body("password")
      .optional()
      .isString()
      .matches(/^.{6,}$/, "i"),
    body("phone").optional().isString().matches(regexes.phoneNumber, "i"),
    body("cpf").optional().isString().matches(regexes.CPF, "i"),
    body("otherResponsible").optional().isString().optional({ nullable: true }),
  ];
};

const queryStringRules = () => {
  return [query("enabled").isIn([true, false, "all"]).optional()];
};

export { accountDepositRules, accountWithdrawRules, queryStringRules };
