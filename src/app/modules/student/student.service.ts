import mongoose from 'mongoose';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // console.log('base', query);
  // const queryObj = { ...query };
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const studentSearchableFields = ['name.firstName', 'email'];

  // // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH  :
  // //  { email: { $regex : query.searchTerm , $options: i}}
  // //  { presentAddress: { $regex : query.searchTerm , $options: i}}
  // //  { 'name.firstName': { $regex : query.searchTerm , $options: i}}

  // //search query
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // //filtering

  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // console.log({ query, queryObj });

  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // //sorting query
  // let sort = '-createdAt';
  // if (query?.sort) {
  //   sort = query?.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // //limit and paginate query

  // let page = 1;
  // let limit = 10;
  // let skip = 0;

  // if (query?.limit) {
  //   limit = Number(query?.limit);
  // }

  // if (query?.page) {
  //   page = Number(query?.page);
  //   skip = Number((page - 1) * limit);
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // //field limiting

  // let fields = '-__v';
  // if (query?.fields) {
  //   fields = (query?.fields as string).split(',').join(' ');
  //   console.log({ fields });
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;

  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
    guardain: {
      fatherOccupation:"Teacher"
    }

    guardian.fatherOccupation = Teacher

    name.firstName = 'Mezba'
    name.lastName = 'Abedin'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSingleStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      {
        new: true,
        session,
      },
    );

    if (!deletedStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      {
        new: true,
        session,
      },
    );

    if (!deletedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteSingleStudentFromDB,
};
