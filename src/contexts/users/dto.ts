export type UserRequest = {
  name: string;

  cpf: string;

  password: string;
};

export type UserResponse = {
  id: string;

  name: string;

  cpf: string;

  enabled: boolean;

  createdAt: Date;

  updatedAt: Date;
};

export interface UserJwtPayload {
  id: string;

  name: string;

  enabled: boolean;

  secret?: string;
}

export type UserAuthRequest = {
  cpf: string;

  password: string;
};

export type UserAuthResponse = {
  accessToken: string;

  expiresIn?: string;
};
