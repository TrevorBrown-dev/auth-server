import { model, Mongoose, ObjectId, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomString } from '../crypto/randomString';
import { sendEmail } from '../mail/sendEmail';
const pendingUserSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        unique: true,
    },
    hash: {
        type: Schema.Types.String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
});
interface PendingUserModel {
    uid: ObjectId;
    hash: string;
    email: string;
}
pendingUserSchema.pre('save', function (next) {
    //Generate random confirmation string
    const user = this;
    const confirmationString = randomString();
    //add hash to pending user
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt
            .hash(confirmationString, salt)
            .then((hash) => {
                //Save hash to pending users
                user.hash = hash;
                //Send hashed string to email
                //Send confirmation email
                sendEmail(
                    user.email,
                    `
                <h1>Hello!</h1>
                <a href="http://localhost:3090/verify/${hash}" >Confirm Email</a>
                `
                );
            })
            .catch((e) => {
                throw e;
            });
    });
});
export const pendingUserModel = model<PendingUserModel>('pendingUser', pendingUserSchema);
