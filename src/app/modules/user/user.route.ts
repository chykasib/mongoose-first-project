import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

const Shenabahini = (req: Request, res: Response, next: NextFunction) => {
  console.log('I am a shenabahini');
};

router.post('/create-student', Shenabahini, UserControllers.createStudent);
export const UserRoutes = router;
