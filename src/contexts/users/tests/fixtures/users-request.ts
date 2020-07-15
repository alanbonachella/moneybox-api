import faker from "faker";
import { UserRequest } from "../../dto";

const usersRequestFixture = (data: any = {}): UserRequest => {
  const userRequest = {
    name: faker.name.findName(),
    cpf: faker.helpers.replaceSymbolWithNumber("###.###.###-##"),
    password: faker.internet.password(6),
  } as UserRequest;

  return {
    ...userRequest,
    ...data,
  };
};

export default usersRequestFixture;
