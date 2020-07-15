import jsonwebtoken from "jsonwebtoken";
import { UserJwtPayload } from "src/contexts/users/dto";
import { TOKEN } from "../env/vars";

const createToken = (userJwtPayload: UserJwtPayload): string => {
  return jsonwebtoken.sign(
    userJwtPayload,
    userJwtPayload.secret || TOKEN.SALT,
    {
      expiresIn: TOKEN.EXPIRES || "24h",
    }
  );
};

const decodeToken = (jwt: string): UserJwtPayload => {
  return jsonwebtoken.decode(jwt, {
    json: true,
    complete: false,
  }) as UserJwtPayload;
};

const verifyToken = (jwt: string, secret?: string) => {
  return jsonwebtoken.verify(jwt, secret || TOKEN.SALT);
};

export { createToken, decodeToken, verifyToken };
