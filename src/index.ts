import express from 'express';
import http from 'http';
import { json } from 'body-parser';
import morgan from 'morgan';
import { router } from './router';
import { connect } from 'mongoose';
import cors from 'cors';
import { sendEmail } from './mail/sendEmail';
import { pendingUserModel } from './models/pendingUser';
//App Setup
const app = express();
app.use(cors());
app.use(json({ type: '*/*' }));
app.use(morgan('combined'));
app.use(router);

//DB Setup
connect('mongodb://localhost/auth');

//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
