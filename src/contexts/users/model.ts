import { BaseModel } from "../../shared/utils/base-model";
import { Account } from "../accounts/model";

export class User extends BaseModel {
  name: string;

  cpf: string;

  password: string;

  enabled: boolean;

  accounts: Account[];

  constructor(
    name: string,
    cpf: string,
    password: string,
    enabled: boolean = true
  ) {
    super();

    this.name = name;
    this.cpf = cpf;
    this.password = password;
    this.enabled = enabled;
  }
}
