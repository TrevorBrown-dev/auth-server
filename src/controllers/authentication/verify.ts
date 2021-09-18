import { RequestHandler } from 'express';
import { pendingUserModel } from '../../models/pendingUser';
import { userModel } from '../../models/user';

export const verify: RequestHandler = (req, res, next) => {
    (async () => {
        const { hash } = req.params;
        //verify hash
        try {
            const pendingUser = await pendingUserModel.findOne({ hash });
            if (pendingUser) {
                //Find him in the user db
                const user = await userModel.findOne({ _id: pendingUser.uid });
                //We've found that user's uid
                if (user) {
                    //Set him to be active
                    user.active = true;
                    //delete the pendingUser
                    pendingUser.delete();
                    return res.redirect('http://localhost:3000/signin');
                }
            }
        } catch (e) {
            res.send('Something went wrong :(');
            throw e;
        }
        res.redirect('http://localhost:3000/');
    })();
};
