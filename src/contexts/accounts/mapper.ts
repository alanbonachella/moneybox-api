import { AccountResponse } from "./dto";
import { Account } from "../accounts/model";
import _ from "lodash";

const toResponse = (account: Account): AccountResponse => {
  return {
    ..._.pick(account, [
      "id",
      "number",
      "agency",
      "balance",
      "createdAt",
      "updatedAt",
    ]),
  };
};

export { toResponse };
