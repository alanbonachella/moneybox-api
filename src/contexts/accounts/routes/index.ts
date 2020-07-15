import express from "express";
import passport from "passport";
import * as accountController from "./controller";
import { accountRules } from "./validator";
import validator from "../../../shared/utils/validator";
import handleException from "../../../shared/utils/handle-exception";
import { ServicesCollection } from "../../../shared/services/setup";
import * as regexes from "../../../shared/utils/regexes";

const accountId = `:accountId(${regexes.UUID.toString()
  .replace(/\/\^|\$\//g, "")
  .replace(/\\/g, "\\\\")})`;

const configureRouter = (services: ServicesCollection) => {
  const router = express.Router();

  router.put(
    `/accounts/${accountId}/deposit`,
    passport.authenticate("jwt", { session: false }),
    accountRules(),
    validator.validate,
    handleException(accountController.deposit(services.db))
  );

  router.put(
    `/accounts/${accountId}/withdraw`,
    passport.authenticate("jwt", { session: false }),
    accountRules(),
    validator.validate,
    handleException(accountController.withdraw(services.db))
  );

  return router;
};

export default configureRouter;
