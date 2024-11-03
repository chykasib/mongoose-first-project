import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';

const getAllStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentFromDB();

    res.status(200).json({
      success: true,
      message: 'Student is retrieved Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.params.studentId;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is retrieved Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.params.studentId;
    const updateData = req.body;

    const result = await StudentServices.updateStudentIntoDB(
      studentId,
      updateData,
    );
    res.status(200).json({
      success: true,
      message: 'Student information updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.params.studentId;
    const result = await StudentServices.deleteSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is deleted Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const StudentControllers = {
  getAllStudent,
  getSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
};
