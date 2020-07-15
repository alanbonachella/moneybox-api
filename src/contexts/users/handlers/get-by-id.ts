import { ErrorHandler } from "../../../shared/utils/error";
import { statusCode } from "../../../shared/utils/status-code";
import { UserResponse } from "../dto";
import { UserRepository } from "../repository";
import { toResponse } from "../mapper";
import { AccountRepository } from "../../../contexts/accounts/repository";

const handler = (
  userRepository: UserRepository,
  accountRepository: AccountRepository
) => async (userId: string): Promise<UserResponse> => {
  const user = await userRepository.findOne(userId);

  if (!user) throw new ErrorHandler(statusCode.NOT_FOUND, "user not found");

  const account = await (await accountRepository.findByUserId(userId)).shift();

  return toResponse(user, account);
};

export default handler;
