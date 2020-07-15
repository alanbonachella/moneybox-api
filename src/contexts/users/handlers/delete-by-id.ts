import { ErrorHandler } from "../../../shared/utils/error";
import { statusCode } from "../../../shared/utils/status-code";
import { UserRepository } from "../repository";

const handler = (userRepository: UserRepository) => async (
  userId: string
): Promise<boolean> => {
  const user = await userRepository.findOne(userId);

  if (!user) throw new ErrorHandler(statusCode.NOT_FOUND, "user not found");

  await userRepository.update(userId, { enabled: false });

  return true;
};

export default handler;
