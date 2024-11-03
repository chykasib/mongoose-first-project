import { TStudent } from './student.interface';
import { Student } from './student.model';

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
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteSingleStudentFromDB,
};
