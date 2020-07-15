import { ErrorHandler } from "../../../shared/utils/error";
import { statusCode } from "../../../shared/utils/status-code";
import { AccountRequest, AccountResponse } from "../dto";
import { AccountRepository } from "../repository";
import { UserRepository } from "../../../contexts/users/repository";
import { User } from "../../../contexts/users/model";

const handler = (
  accountRepository: AccountRepository,
  userRepository: UserRepository
) => async (
  user: User,
  accountId: string,
  req: AccountRequest
): Promise<AccountResponse> => {
  const userFound = await userRepository.findOne(user.id);

  if (!userFound)
    throw new ErrorHandler(statusCode.NOT_FOUND, "user not found");

  const accountFound = await accountRepository.findOne(accountId);

  if (!accountFound)
    throw new ErrorHandler(statusCode.NOT_FOUND, "account not found");

  const withdrawValue = req.value;

  accountFound.withdraw(withdrawValue);

  return {
    cells: accountFound.countNotes(withdrawValue),
    account: accountFound,
  };
};

export default handler;
