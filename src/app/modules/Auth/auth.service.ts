import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUserIntoDB = async (payload: TLoginUser) => {
  //check if the isUserExit
  const isUserExit = await User.findOne({ id: payload?.id });
  if (!isUserExit) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
  }

  //check if the user is already deleted
  const isDeleted = isUserExit?.isDeleted;
  if (isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted');
  }
};

//check if the user is blocked
const isBlocked = isUserExit?.status === 'blocked';
if (isBlocked) {
  throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted');
}
console.log(isUserExit);

export const loginUseServices = {
  loginUserIntoDB,
};
