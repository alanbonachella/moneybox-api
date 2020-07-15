import { ErrorHandler } from "../../../shared/utils/error";
import { statusCode } from "../../../shared/utils/status-code";
import { UserRequest, UserResponse } from "../dto";
import { User } from "../model";
import { UserRepository } from "../repository";
import { toResponse } from "../mapper";
import { generatePassword } from "../../../shared/utils/password";

const handler = (userRepository: UserRepository) => async (
  req: UserRequest
): Promise<UserResponse> => {
  const existingUserCPF = await userRepository.findOne({
    cpf: req.cpf.trim(),
  });

  if (existingUserCPF) {
    throw new ErrorHandler(
      statusCode.CONFLICT,
      `The User CPF ${req.cpf} already exists`
    );
  }

  const user = new User(
    req.name.trim(),
    req.cpf.trim(),
    await generatePassword(req.password)
  );

  const userCreated = await userRepository.save(user);

  return toResponse(userCreated);
};

export default handler;
