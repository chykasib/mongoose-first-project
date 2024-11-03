import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/', StudentControllers.getAllStudent);
router.get('/:studentId', StudentControllers.getSingleStudent);
router.patch('/:studentId', StudentControllers.updateSingleStudent);
router.delete('/:studentId', StudentControllers.deleteSingleStudent);
export const StudentRoutes = router;
