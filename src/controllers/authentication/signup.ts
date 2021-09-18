import { RequestHandler } from 'express';
import { encryptJwt } from '../../crypto';
import { generatePendingUser, pendingUserModel } from '../../models/pendingUser';
import { userModel, UserModel } from '../../models/user';

export const signup: RequestHandler = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422);
        res.send({
            error: 'You must provide an email and password!',
        });
        return;
    }
    //See if a user with a given email exists
    userModel.findOne({ email }, (err: any, existingUser: UserModel) => {
        if (err) return next(err);
        //If user exists, return an error
        if (existingUser) return res.status(422).send({ error: 'Email is in use!' });

        //If it does not exist, create and save user record!
        const user = new userModel({
            email,
            password,
            active: false,
        });
        user.save()
            .then((user) => {
                generatePendingUser(user.email, user._id);
                //We need to give some token
                //Respond to request
                res.json({ token: encryptJwt(user) });
            })
            .catch((err) => {
                return next(err);
            });
    });
};
