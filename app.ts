import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';

dotenv.config();

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

