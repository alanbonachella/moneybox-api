import { UserRepository } from "../../contexts/users/repository";
import { AccountRepository } from "../../contexts/accounts/repository";

export class Connection {
  userRepository: UserRepository;

  accountRepository: AccountRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRepository();
  }
}

const connectDb = () => {
  const connection = new Connection();
  return connection;
};

export { connectDb };
