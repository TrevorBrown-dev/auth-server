import { Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
//Define the model

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: String,
});
export interface UserModel {
    id: string;
    email: string;
    password: string;
}

//On save hook, encrypt password
//Before saving the model run this function
userSchema.pre('save', function (next) {
    //The context is the user model, you have to use a plain function like you would in a class.
    const user = this;

    //Generaete a salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        //Hash the pasword with the salt
        bcrypt
            .hash(user.password, salt)
            .then((hash) => {
                //Overwrite plaintext password with encrypted password
                user.password = hash;

                //Continue on as normal
                next();
            })
            .catch((e) => {
                throw e;
            });
    });
});

userSchema.method('comparePassword', function (candidatePassword: string, callback: (...args: any) => any) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);

        callback(null, isMatch);
    });
});

//Create and export the model
export const userModel = model<UserModel>('user', userSchema);
