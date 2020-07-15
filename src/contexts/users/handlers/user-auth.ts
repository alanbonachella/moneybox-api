import { ErrorHandler } from "../../../shared/utils/error";
import { createToken } from "../../../shared/utils/token";
import { statusCode } from "../../../shared/utils/status-code";
import { generatePassword } from "../../../shared/utils/password";
import { UserAuthRequest, UserAuthResponse } from "../dto";
import { toUserAuthResponse } from "../mapper";
import { UserRepository } from "../repository";

const handler = (userRepository: UserRepository) => async (
  req: UserAuthRequest
): Promise<UserAuthResponse> => {
  const userFound = await userRepository.find({
    cpf: req.cpf.trim(),
    password: await generatePassword(req.password),
    enabled: true,
  });

  if (!userFound.length)
    throw new ErrorHandler(statusCode.UNAUTHORIZED, "invalid credentials");

  const result = {
    accessToken: createToken({
      id: userFound[0].id,
      name: userFound[0].name,
      enabled: true,
    }),
  };

  return toUserAuthResponse(result);
};

export default handler;
