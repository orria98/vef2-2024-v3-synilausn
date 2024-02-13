import express, { Request, Response, NextFunction } from 'express';
import { sayHello } from '../lib/hello.js';

export const router = express.Router();

export async function hello(req: Request, res: Response, next: NextFunction) {
  res.json({ hello: sayHello('world') });
  next();
}

export async function bye() {
  console.log('done');
}

export async function error() {
  throw new Error('error');
}

router.get('/test', hello, bye);

// Mun crasha öllu
router.get('/error', error);
