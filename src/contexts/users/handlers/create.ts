import { ErrorHandler } from "../../../shared/utils/error";
import { statusCode } from "../../../shared/utils/status-code";
import { UserRequest, UserResponse } from "../dto";
import { User } from "../model";
import { UserRepository } from "../repository";
import { toResponse } from "../mapper";
import { generatePassword } from "../../../shared/utils/password";
import { Account } from "../../../contexts/accounts/model";
import { AccountRepository } from "../../../contexts/accounts/repository";

const handler = (
  userRepository: UserRepository,
  accountRepository: AccountRepository
) => async (req: UserRequest): Promise<UserResponse> => {
  const existingUserCPF = await userRepository.find({
    cpf: req.cpf.trim(),
  });

  if (existingUserCPF.length) {
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

  const accountAgency = Math.floor(Math.random() * 999);
  const accountNumber = Math.floor(Math.random() * 9999999);

  const account = new Account(user, accountNumber, accountAgency);

  const accountCreated = await accountRepository.save(account);

  if (!accountCreated) {
    throw new ErrorHandler(
      statusCode.UNPROCESSABLE_ENTITY,
      `The ${user.name} user's account not created successfully`
    );
  }

  const userCreated = await userRepository.save(user);

  return toResponse(userCreated, accountCreated);
};

export default handler;
