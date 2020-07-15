import { UserResponse, UserAuthResponse } from "./dto";
import { User } from "./model";
import _ from "lodash";

const toResponse = (item: User): UserResponse => {
  return _.pick(item, [
    "id",
    "name",
    "cpf",
    "enabled",
    "createdAt",
    "updatedAt",
  ]);
};

const toUserAuthResponse = (item: Object): UserAuthResponse => {
  return _.pick(item, ["accessToken", "expiresIn"]);
};

export { toResponse, toUserAuthResponse };
