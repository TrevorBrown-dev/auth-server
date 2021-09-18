import { model, ObjectId, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomString } from '../crypto/randomString';
import { sendEmail } from '../mail/sendEmail';
import { userModel } from './user';
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

export const generatePendingUser = (email: string, uid: Schema.Types.ObjectId) => {
    //sanatize the hash
    const hash = randomString().replace(/\/|\\|\+/g, '_');
    //add hash to pending user
    new pendingUserModel({
        uid,
        email,
        hash,
    })
        .save()
        .then(() => {
            //Send confirmation email with hashed string
            sendEmail(
                email,
                `
                        <h1>Hello!</h1>
                        <a href="http://localhost:3090/verify/${hash}" >Confirm Email</a>
                        `
            );
        });
};

export const pendingUserModel = model<PendingUserModel>('pendingusers', pendingUserSchema);
