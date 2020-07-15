import express from "express";
import passport from "passport";
import * as userController from "./controller";
import { usersRules, usersPatchRules } from "./validator";
import validator from "../../../shared/utils/validator";
import handleException from "../../../shared/utils/handle-exception";
import { ServicesCollection } from "../../../shared/services/setup";
import * as regexes from "../../../shared/utils/regexes";

const userId = `:userId(${regexes.UUID.toString()
  .replace(/\/\^|\$\//g, "")
  .replace(/\\/g, "\\\\")})`;

const configureRouter = (services: ServicesCollection) => {
  const router = express.Router();

  router.post(
    "/users",
    passport.authenticate("jwt", { session: false }),
    usersRules(),
    validator.validate,
    handleException(userController.create(services.db))
  );

  router.get(
    `/users/${userId}`,
    passport.authenticate("jwt", { session: false }),
    handleException(userController.findById(services.db))
  );

  router.get(
    "/users",
    passport.authenticate("jwt", { session: false }),
    // validator.checkQueryStr(["enabled"]),
    // queryStringRules(),
    validator.validate,
    handleException(userController.findAll(services.db))
  );

  router.delete(
    `/users/${userId}`,
    passport.authenticate("jwt", { session: false }),
    handleException(userController.deleteById(services.db))
  );

  router.put(
    `/users/${userId}`,
    passport.authenticate("jwt", { session: false }),
    usersRules(),
    validator.validate,
    handleException(userController.update(services.db))
  );

  router.patch(
    `/users/${userId}`,
    passport.authenticate("jwt", { session: false }),
    usersPatchRules(),
    validator.validate,
    handleException(userController.update(services.db))
  );

  return router;
};

export default configureRouter;
