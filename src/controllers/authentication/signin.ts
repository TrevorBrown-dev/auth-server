import { RequestHandler } from 'express';
import { encryptJwt } from '../../crypto';
import { UserModel } from '../../models/user';

export const signin: RequestHandler = async (req, res, next) => {
    //User has had their email and password authed at this point.
    //We just need to give them a token
    // if(req.user)
    if (req.user) {
        if ((req.user as UserModel).active) res.json({ token: encryptJwt(req.user) });
        else res.json({ error: 'Please confirm your account first!' });
    } else res.json({ error: 'Account not found!' });
};
