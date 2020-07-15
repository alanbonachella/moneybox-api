import jwt from "passport-jwt";

import { ErrorHandler } from "./error";
import { statusCode } from "./status-code";
import { User } from "../../contexts/users/model";
import { TOKEN } from "../env/vars";

const checkJwt = async (user: User, done) => {
  try {
    done(null, user);
  } catch (error) {
    done(
      new ErrorHandler(
        statusCode.INTERNAL_SERVER_ERROR,
        "internal server error"
      )
    );
  }
};

const configureLocalStrategy = () => {
  const jwtOptions = {
    jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderWithScheme(TOKEN.METHOD),
    secretOrKey: TOKEN.SALT,
    ignoreExpiration: true,
  };

  return new jwt.Strategy(jwtOptions, checkJwt);
};

const strategy = configureLocalStrategy();

export { strategy };
