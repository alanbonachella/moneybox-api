import { UserResponse, UserAuthResponse } from "./dto";
import { User } from "./model";
import * as accountMapper from "../accounts/mapper";
import { Account } from "../accounts/model";
import _ from "lodash";

const toResponse = (user: User, account?: Account): UserResponse => {
  return {
    ..._.pick(user, ["id", "name", "cpf", "enabled", "createdAt", "updatedAt"]),
    account: accountMapper.toResponse(account) || undefined,
  };
};

const toUserAuthResponse = (item: Object): UserAuthResponse => {
  return _.pick(item, ["accessToken", "expiresIn"]);
};

export { toResponse, toUserAuthResponse };
