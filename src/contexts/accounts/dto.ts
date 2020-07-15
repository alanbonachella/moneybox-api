import { Account } from "./model";

export type AccountRequest = {
  id: string;
  value: number;
};

export type AccountResponse = {
  cells: Cell[];
  account: Account;
};

export type Cell = {
  quantity: number;

  value: number;
};
