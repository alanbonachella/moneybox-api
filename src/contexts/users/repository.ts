import { User } from "./model";

export class UserRepository {
  async save(user: any): Promise<User> {
    return null;
  }

  async findOne(id: string | any): Promise<User> {
    return null;
  }

  async find(queryOptions): Promise<User[]> {
    return null;
  }

  async update(id: string, user: any): Promise<User> {
    return null;
  }

  async merge(user: any, req: any): Promise<User> {
    return null;
  }
}
