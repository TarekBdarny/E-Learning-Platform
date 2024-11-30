import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";

dotenv.config();
const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    async (payload, done) => {
      console.log("payLoad: ", payload);
      try {
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
