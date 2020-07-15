import express from "express";
import { validationResult } from "express-validator";
import { ErrorHandler } from "./error";
import { statusCode } from "./status-code";

const validate = (req: express.Request, res: express.Response, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors
    .array()
    .map((err) => `${err.msg} in ${err.param}`);

  next(new ErrorHandler(statusCode.BAD_REQUEST, extractedErrors.join(", ")));
};

const checkQueryStr = (params: string[]) => {
  return async (req: express.Request, res: express.Response, next) => {
    const propertiesNotValid = Object.keys(req.query).filter(
      (item) => !params.includes(item)
    );

    if (propertiesNotValid.length > 0)
      return next(
        new ErrorHandler(
          statusCode.BAD_REQUEST,
          `Properties not valid: ${propertiesNotValid.join(", ")}`
        )
      );

    next();
  };
};

export default {
  validate,
  checkQueryStr,
};
