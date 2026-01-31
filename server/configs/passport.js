import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import passport from "passport";
import User from "../models/User.js";



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try{
       let user = await User.findOneAndUpdate({ googleId: profile.id }, {isLoggedIn: true});

       if(!user) {
        user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.email[0].value,
            avatar: profile.photos[0].value,
        })
       }

       return document(null, user);

    } catch(error) {
        return document(error, null)
    }

  }
));