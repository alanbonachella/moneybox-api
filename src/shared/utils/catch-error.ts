import { ErrorHandler } from "../utils/error";
import express from "express";

export default (
  err: ErrorHandler,
  req: express.Request,
  res: express.Response,
  next
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //   console.log("Catch err -> ", err);

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
  });

  next();
};
