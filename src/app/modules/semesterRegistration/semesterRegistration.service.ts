import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  /**
   * Step1: Check if there any registered semester that is already 'UPCOMING'|'ONGOING'
   * Step2: Check if the semester is exist
   * Step3: Check if the semester is already registered!
   * Step4: Create the semester registration
   */
  const isThereAnyUpcomingOrOngoingSEmester =
    await SemesterRegistration.findOne({
      $or: [
        {
          status: RegistrationStatus.UPCOMING,
        },
        {
          status: RegistrationStatus.ONGOING,
        },
      ],
    });
  if (isThereAnyUpcomingOrOngoingSEmester) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSEmester.status} registered semester !`,
    );
  }
  const academicSemester = payload?.academicSemester;
  // check if the semester is exist
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This academic semester not found',
    );
  }

  // check if the semester registration already is exist
  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'This semester is already registered!',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};
const getSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the requested registered semester is exists
  // check if the semester is already registered!
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This semester is not found !');
  }

  //if the requested semester registration is ended , we will not update anything
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedStatus = payload?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    );
  }
  // UPCOMING -> ONGOING -> ENDED

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
