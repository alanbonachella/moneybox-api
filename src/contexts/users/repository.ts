import { User } from "./model";
import _ from "lodash";

export class UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    this.users = [user, ...this.users.filter((item) => item.id != user.id)];

    return user;
  }

  async findOne(userId: string): Promise<User> {
    const user = this.users.filter((item) => item.id == userId);
    return user[0] || null;
  }

  async find(userQuery: any): Promise<User[]> {
    const users = this.users.filter((item) => {
      const userNested = _.pick(item, Object.keys(userQuery));

      return JSON.stringify(userNested) == JSON.stringify(userQuery);
    });
    return users;
  }

  async update(id: string, user: any): Promise<User> {
    const userFound = this.users.filter((item) => item.id == id).shift();

    const userUpdated = { ...userFound, ...user } as User;

    this.users = [
      userUpdated,
      ...this.users.filter((item) => item.id != userFound.id),
    ];

    return userUpdated;
  }

  async merge(user: User, req: any): Promise<User> {
    return Object.assign(user, req);
  }
}
