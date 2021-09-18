import { RequestHandler } from 'express';
import { config } from '../env';
import * as jwt from 'jwt-simple';
import { UserModel, userModel } from '../models/user';

const tokenForUser = (user: any) => {
    const timestamp = Date.now();
    return jwt.encode(
        {
            sub: user.id,
            iat: timestamp,
        },
        config.JWT_SECRET as string
    );
};

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
    userModel.findOne(
        {
            email,
        },
        (err: any, existingUser: UserModel) => {
            if (err) return next(err);
            //If user exists, return an error
            if (existingUser) return res.status(422).send({ error: 'Email is in use!' });

            //If it does not exist, create and save user record!
            const user = new userModel({
                email,
                password,
            });
            user.save()
                .then(() => {
                    //We need to give some token
                    //Respond to request
                    res.json({ token: tokenForUser(user) });
                })
                .catch((err) => {
                    return next(err);
                });
        }
    );
};

export const signin: RequestHandler = (req, res, next) => {
    //User has had their email and password authed at this point.
    //We just need to give them a token
    if (req.user) res.send({ token: tokenForUser(req.user) });
};
