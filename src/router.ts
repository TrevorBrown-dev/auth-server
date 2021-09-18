import { Router } from 'express';
import passport from 'passport';
import { signup, signin, verify } from './controllers/authentication';
import { jwtLogin, localLogin } from './services/passport';
export const router = Router();
const requireAuth = passport.authenticate(jwtLogin, { session: false });
const requreSignin = passport.authenticate(localLogin, { session: false });
router.post('/signin', requreSignin, signin);
router.post('/signup', signup);

router.get('/verify/:hash', verify);

router.get('/user', requireAuth, (req, res) => {
    console.log(req.user);
    res.json(req.user);
});
