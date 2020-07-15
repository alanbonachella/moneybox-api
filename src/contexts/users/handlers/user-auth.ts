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
  const user = await userRepository.findOne({
    cpf: req.cpf.trim(),
    password: await generatePassword(req.password),
    enabled: true,
  });

  if (!user)
    throw new ErrorHandler(statusCode.UNAUTHORIZED, "invalid credentials");

  const result = {
    accessToken: createToken({
      id: user.id,
      name: user.name,
      enabled: true,
    }),
  };

  return toUserAuthResponse(result);
};

export default handler;
