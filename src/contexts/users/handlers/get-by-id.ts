import { ErrorHandler } from "../../../shared/utils/error";
import { statusCode } from "../../../shared/utils/status-code";
import { UserResponse } from "../dto";
import { UserRepository } from "../repository";
import { toResponse } from "../mapper";

const handler = (userRepository: UserRepository) => async (
  userId: string
): Promise<UserResponse> => {
  const user = await userRepository.findOne(userId);

  if (!user) throw new ErrorHandler(statusCode.NOT_FOUND, "user not found");

  return toResponse(user);
};

export default handler;
