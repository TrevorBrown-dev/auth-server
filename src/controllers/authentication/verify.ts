import { RequestHandler } from 'express';
import { pendingUserModel } from '../../models/pendingUser';
import { userModel } from '../../models/user';

export const verify: RequestHandler = (req, res, next) => {
    const { hash } = req.params;
    //verify hash
    pendingUserModel
        .findOne({ hash })
        .then((pendingUser) => {
            if (pendingUser) {
                //Find him in the user db
                userModel
                    .updateOne(
                        { _id: pendingUser.uid },
                        {
                            active: true,
                        }
                    )
                    .then((user) => {
                        //We've found that user's uid
                        if (user) {
                            //Set him to be active
                            //delete the pendingUser
                            pendingUser.delete();
                            res.redirect('http://localhost:3000/signin');
                        }
                    })
                    .catch((e) => res.send('Something went wrong :('));
            }
        })
        .catch((e) => res.send('Something went wrong :('));
};
