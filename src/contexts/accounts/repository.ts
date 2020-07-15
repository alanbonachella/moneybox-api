import { Account } from "./model";
import _ from "lodash";

export class AccountRepository {
  private accounts: Account[] = [];

  async save(account: Account): Promise<Account> {
    this.accounts = [
      account,
      ...this.accounts.filter((item) => item.id != account.id),
    ];

    return account;
  }

  async findOne(accountId: string): Promise<Account> {
    const accounts = this.accounts.filter((item) => item.id == accountId);

    return accounts[0] || null;
  }

  async find(accountQuery: any): Promise<Account[]> {
    const accounts = this.accounts.filter((item) => {
      const accountNested = _.pick(item, Object.keys(accountQuery));

      return JSON.stringify(accountNested) == JSON.stringify(accountQuery);
    });

    return accounts;
  }

  async findByUserId(userId: any): Promise<Account[]> {
    const accounts = this.accounts.filter((item) => item.user.id == userId);

    return accounts;
  }

  async update(accountId: string, account: any): Promise<Account> {
    const accountFound = this.accounts
      .filter((item) => item.id == accountId)
      .shift();

    const accountUpdated = { ...accountFound, ...account } as Account;

    this.accounts = [
      accountUpdated,
      ...this.accounts.filter((item) => item.id != account.id),
    ];
    return accountUpdated;
  }

  async merge(account: Account, req: any): Promise<Account> {
    return Object.assign(account, req);
  }
}
