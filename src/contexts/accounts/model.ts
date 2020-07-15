import { BaseModel } from "../../shared/utils/base-model";
import { User } from "../users/model";

export class Account extends BaseModel {
  user: User;
  balance: number;
  withdrawn: number;
  paidIn: number;
  payInLimit: number = 4000;
}
