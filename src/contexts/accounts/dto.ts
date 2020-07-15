export type AccountRequest = {
  name: string;

  cpf: string;

  password: string;

  enabled: boolean;
};

export type AccountResponse = {
  id: string;

  name: string;

  cpf: string;

  enabled: boolean;

  createdAt: Date;

  updatedAt: Date;
};
