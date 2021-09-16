import { Router } from 'express';
import passport from 'passport';
import { signup, signin } from './controllers/authentication';
import { jwtLogin, localLogin } from './services/passport';
export const router = Router();
const requireAuth = passport.authenticate(jwtLogin, { session: false });
const requreSignin = passport.authenticate(localLogin, { session: false });
router.post('/signin', requreSignin, signin);
router.post('/signup', signup);
