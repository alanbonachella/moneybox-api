import faker from "faker";
import { User } from "../../../users/model";

const usersFixture = (data: any = {}): User => {
  const user = new User(
    faker.name.findName(),
    faker.helpers.replaceSymbolWithNumber("###.###.###-##"),
    faker.internet.password(6)
  );

  return {
    id: faker.random.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...user,
    ...data,
  };
};

export default usersFixture;
