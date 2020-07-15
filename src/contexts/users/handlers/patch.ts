import { ErrorHandler } from "../../../shared/utils/error";
import { statusCode } from "../../../shared/utils/status-code";
import { UserRepository } from "../repository";
import { UserRequest, UserResponse } from "../dto";
import { toResponse } from "../mapper";

const handler = (userRepository: UserRepository) => async (
  userId: string,
  req: UserRequest
): Promise<UserResponse> => {
  const user = await userRepository.findOne(userId);

  if (!user) throw new ErrorHandler(statusCode.NOT_FOUND, "user not found");

  if (req.cpf) {
    const existingUserCPF = await userRepository.find({ cpf: req.cpf.trim() });

    if (existingUserCPF.length) {
      throw new ErrorHandler(
        statusCode.CONFLICT,
        `The user CPF ${req.cpf} already exists`
      );
    }
  }

  userRepository.merge(user, req);

  const userUpdated = await userRepository.save(user);

  return toResponse(userUpdated);
};

export default handler;
