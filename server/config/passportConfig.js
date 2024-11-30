import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import userModel from "../db/models/user.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
dotenv.config();
// Configure the Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const oldUser = await userModel.findOne({ email: profile._json.email });
        if (oldUser) {
          const existingProvider = oldUser.providers.find(
            (provider) =>
              provider.provider === "google" &&
              provider.providerId === profile.id
          );

          if (!existingProvider) {
            // If the provider is not linked, add it
            oldUser.providers.push({
              provider: "google",
              providerId: profile.id,
            });
            await oldUser.save();
          }
          return done(null, oldUser);
        }
      } catch (err) {
        console.log(err);
      }

      try {
        // Create a new user if they don't exist
        const newUser = new userModel({
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          providers: [
            {
              provider: "google",
              providerId: profile.id,
            },
          ],
          username: `${profile._json.given_name}${
            profile._json.family_name
          }#${generateVerificationToken()}`,
          email: profile._json.email,
          isVerified: true,
          verificationToken: undefined,
          verificationTokenExpiresAt: undefined,
          avatar: profile._json.picture,
          userId: uuid(),
          password: "password", // Placeholder password for demonstration purposes
        });
        await newUser.save();
        // Generate JWT token

        done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let email = null;
      // Check if emails are available in the profile object
      if (profile.emails && profile.emails.length > 0) {
        email = profile.emails[0].value;
      } else {
        // If not, fetch emails using GitHub API
        const response = await fetch("https://api.github.com/user/emails", {
          headers: { Authorization: `token ${accessToken}` },
        });
        const emails = await response.json();

        // Find the primary or first email
        const primaryEmail = emails.find((email) => email.primary) || emails[0];
        email = primaryEmail ? primaryEmail.email : null;
      }
      try {
        const oldUser = await userModel.findOne({ email });
        console.log(profile);
        if (oldUser) {
          const existingProvider = oldUser.providers.find(
            (provider) =>
              provider.provider === "github" &&
              provider.providerId === profile._json.id
          );
          console.log(existingProvider);
          if (!existingProvider) {
            oldUser.providers.push({
              provider: "github",
              providerId: profile._json.id,
            });
            await oldUser.save();
          }
          return done(null, oldUser);
        }
      } catch (err) {
        console.log(err);
      }

      try {
        // Create a new user if they don't exist
        let name = profile.displayName
          ? profile.displayName.split(" ")
          : profile.username.split(" ");
        const newUser = await new userModel({
          firstName: name[0],
          lastName: name[name.length - 1],
          provider: "github",
          username: `${profile.username}#${generateVerificationToken()}`,
          email,
          providers: [
            {
              provider: "github",
              providerId: profile.id,
            },
          ],
          isVerified: true,
          verificationToken: undefined,
          verificationTokenExpiresAt: undefined,
          avatar: profile._json.avatar_url,
          userId: uuid(),
          password: "password", // Placeholder password for demonstration purposes
        }).save();
        // // Generate JWT token
        done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

export default passport;
