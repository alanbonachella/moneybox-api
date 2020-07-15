import { UserRepository } from "../repository";
import { UserResponse } from "../dto";
import { toResponse } from "../mapper";

const handler = (userRepository: UserRepository) => async (): Promise<
  UserResponse[]
> => {
  const users = await userRepository.find({ enabled: true });

  return users.map((user) => toResponse(user));
};

export default handler;
