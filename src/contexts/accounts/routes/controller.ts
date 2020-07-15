import express from "express";
import * as accountHandlers from "../handlers";
import { statusCode } from "../../../shared/utils/status-code";
import { AccountRequest } from "../dto";
import { User } from "../../../contexts/users/model";
import { Connection } from "../../../shared/db";

const deposit = (db: Connection) => async (
  req: express.Request,
  res: express.Response
) => {
  const user = req.user as User;

  const accountId = req.params.accountId as string;

  const accountRequest = req.body as AccountRequest;

  const result = await accountHandlers.deposit(
    db.accountRepository,
    db.userRepository
  )(user, accountId, accountRequest);

  return res.status(statusCode.OK).json(result);
};

const withdraw = (db: Connection) => async (
  req: express.Request,
  res: express.Response
) => {
  const user = req.user as User;

  const accountId = req.params.accountId as string;

  const accountRequest = req.body as AccountRequest;

  const result = await accountHandlers.withdraw(
    db.accountRepository,
    db.userRepository
  )(user, accountId, accountRequest);

  return res.status(statusCode.OK).json(result);
};

export { deposit, withdraw };
