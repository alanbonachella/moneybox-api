import { BaseModel } from "../../shared/utils/base-model";

export class User extends BaseModel {
  name: string;

  cpf: string;

  password: string;

  enabled: boolean;

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
