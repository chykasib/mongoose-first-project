import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import StudentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const student = req.body;
    // const { error, value } = StudentValidationSchema.validate(student);
    const zodParseData = StudentValidationSchema.parse(student);
    const result = await StudentServices.createStudentIntoDB(zodParseData);

    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: 'Something went wrong',
    //     error: error.details,
    //   });
    // }

    res.status(200).json({
      success: true,
      message: 'Student is Created Successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    });
  }
};

const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentFromDB();

    res.status(200).json({
      success: true,
      message: 'Student is retrieved Successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error,
    });
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is retrieved Successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error,
    });
  }
};

const updateSingleStudent = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error,
    });
  }
};

const deleteSingleStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result = await StudentServices.deleteSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is deleted Successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error,
    });
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
};
