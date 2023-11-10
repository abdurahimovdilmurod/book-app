import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { categoryRouter } from './controller/category.controller';
import bodyParser from 'body-parser';
import { bookRouter } from './controller/book.controller';
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect('mongodb://localhost/book-app')
.then(()=>{
  console.log("MongoDb ga ulanishda hosil qilindi......");
})
.catch((err) => {
  console.log("MongoDb ga ulanishda xatolik ro'y berdi", err);
});

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json({}));  
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/category', categoryRouter);
app.use('/book', bookRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});