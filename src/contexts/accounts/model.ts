import { BaseModel } from "../../shared/utils/base-model";
import { ErrorHandler } from "../../shared/utils/error";
import { statusCode } from "../../shared/utils/status-code";
import { User } from "../users/model";
import { Cell } from "./dto";

export class Account extends BaseModel {
  private cellsAvailable = [100, 50, 20, 10];

  private cellsUsed: Cell[] = [];

  user: User;
  number: number;
  agency: number;
  balance: number;

  deposit(value: number) {
    if (value < 0)
      throw new ErrorHandler(
        statusCode.UNPROCESSABLE_ENTITY,
        `The account deposit must be greater than zero`
      );

    this.balance += value;
  }

  withdraw(value: number) {
    if (value > this.balance)
      throw new ErrorHandler(
        statusCode.UNPROCESSABLE_ENTITY,
        `The account withdraw must be less than account balance`
      );

    this.balance -= value;
  }

  countNotes(value: number): Cell[] {
    let remainingAmount = value;

    this.cellsAvailable.forEach((noteValue) => {
      let notesNumber = 0;
      for (let n = 0; noteValue * n < remainingAmount; ) {
        notesNumber = n;
        n = n + 1;
      }

      remainingAmount -= notesNumber * noteValue;
      this.cellsUsed.push({
        quantity: notesNumber,
        value: noteValue,
      });
    });

    return this.cellsUsed;
  }

  constructor(user: User, number: number, agency: number, balance: number = 0) {
    super();

    this.user = user;
    this.number = number;
    this.agency = agency;
    this.balance = balance;
  }
}
