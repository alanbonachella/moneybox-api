import { ErrorHandler } from "../../../shared/utils/error";
import { statusCode } from "../../../shared/utils/status-code";
import { AccountRequest, AccountResponse } from "../dto";
import { Account } from "../model";
import { AccountRepository } from "../repository";
import { generatePassword } from "../../../shared/utils/password";
import { UserRepository } from "../../../contexts/users/repository";
import { User } from "../../../contexts/users/model";

const handler = (
  accountRepository: AccountRepository,
  userRepository: UserRepository
) => async (user: User, req: AccountRequest): Promise<AccountResponse> => {
  return null;
};

export default handler;
