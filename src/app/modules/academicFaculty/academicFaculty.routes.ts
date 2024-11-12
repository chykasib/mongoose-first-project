import express from 'express';
import { AcademicSemesterControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicFaculty,
);
router.get('/', AcademicSemesterControllers.getAllAcademicFaculties);
router.get('/:facultyId', AcademicSemesterControllers.getSingleAcademicFaculty);
router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
