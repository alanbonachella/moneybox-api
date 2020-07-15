import express from "express";
import * as userHandlers from "../handlers";
import { statusCode } from "../../../shared/utils/status-code";
import { UserRequest } from "../dto";
import { Connection } from "../../../shared/db";

const create = (db: Connection) => async (
  req: express.Request,
  res: express.Response
) => {
  const user = req.body as UserRequest;

  const result = await userHandlers.create(db.userRepository)(user);

  return res.status(statusCode.CREATED).json(result);
};

const findById = (db: Connection) => async (
  req: express.Request,
  res: express.Response
) => {
  const userId = req.params.userId as string;

  const result = await userHandlers.getById(db.userRepository)(userId);

  return res.status(statusCode.OK).json(result);
};

const findAll = (db: Connection) => async (
  req: express.Request,
  res: express.Response
) => {
  const result = await userHandlers.getAll(db.userRepository)();

  return res.status(statusCode.OK).json(result);
};

const deleteById = (db: Connection) => async (
  req: express.Request,
  res: express.Response
) => {
  const userId = req.params.userId as string;

  const result = await userHandlers.deleteById(db.userRepository)(userId);

  return res.status(statusCode.NO_CONTENT).send();
};

const update = (db: Connection) => async (
  req: express.Request,
  res: express.Response
) => {
  const userId = req.params.userId as string;

  const user = req.body as UserRequest;

  const result = await userHandlers.update(db.userRepository)(userId, user);

  return res.status(statusCode.OK).json(result);
};

export { create, findById, findAll, deleteById, update };
