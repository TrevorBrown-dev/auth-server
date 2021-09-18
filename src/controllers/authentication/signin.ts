import { RequestHandler } from 'express';
import { encryptJwt } from '../../crypto';

export const signin: RequestHandler = async (req, res, next) => {
    //User has had their email and password authed at this point.
    //We just need to give them a token
    if (req.user) res.send({ token: encryptJwt(req.user) });
};
