import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { loginUseServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await loginUseServices.loginUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User is logged in Successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
};
