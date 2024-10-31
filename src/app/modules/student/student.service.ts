import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  if (await Student.isUserExits(studentData.id)) {
    throw new Error('User already exists!');
  }
  const result = await Student.create(studentData); //built in static methods
  // const student = new Student(studentData); //built in instance methods
  // if (await student.isUserExits(studentData.id)) {
  //   throw new Error('User already exists!');
  // }
  // const result = await student.save();
  return result;
};

const getAllStudentFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.aggregate([
    {
      $match: {
        id: id,
      },
    },
  ]);
  return result;
};

const updateStudentIntoDB = async (
  id: string,
  updateData: Partial<TStudent>,
) => {
  const result = await Student.updateOne(
    { id },
    { $set: updateData },
    { upsert: true },
  );
  return result;
};

const deleteSingleStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteSingleStudentFromDB,
};
