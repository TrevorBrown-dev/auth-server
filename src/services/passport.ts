import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { config } from '../env';
import { UserModel, userModel } from '../models/user';
import { IStrategyOptions, Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
//Setup options for JTS Strategy
const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET,
};
//Create JWT strategy
export const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    //See if the userID in the payload exists in our database
    //If it does, call 'done' with that user
    //otherwise call done without a user object
    userModel.findById(payload.sub as string, (err: Error, user: UserModel) => {
        if (err) return done(err, false);
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

//Create Local Strategy
const localOptions: IStrategyOptions = {
    usernameField: 'email',
};

export const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    //Verify this username and password, call done with the email and pass is correct
    //Otherwise, call done with false
    userModel.findOne({ email }, (err: Error, user: any | null) => {
        //We return done when we want to break out of the function.
        if (err) return done(err, false);
        if (!user) return done(null, false);

        //compare password - is 'password' equal to user.password?
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            //If there's no password match return false
            if (!isMatch) return done(null, false);

            //Otherwise return the user object
            return done(null, user);
        });
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
