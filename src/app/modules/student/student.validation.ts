// import Joi from 'joi';

// // Joi Schema for Guardian
// const GuardianSchema = Joi.object({
//   fatherName: Joi.string().trim().required().messages({
//     'any.required': "Father's name is required",
//   }),
//   fatherOccupation: Joi.string().trim().required().messages({
//     'any.required': "Father's occupation is required",
//   }),
//   fatherContactNo: Joi.string().trim().required().messages({
//     'any.required': "Father's contact number is required",
//   }),
//   motherName: Joi.string().trim().required().messages({
//     'any.required': "Mother's name is required",
//   }),
//   motherOccupation: Joi.string().trim().required().messages({
//     'any.required': "Mother's occupation is required",
//   }),
//   motherContactNo: Joi.string().trim().required().messages({
//     'any.required': "Mother's contact number is required",
//   }),
// });

// // Joi Schema for UserName
// const UserNameSchema = Joi.object({
//   firstName: Joi.string()
//     .trim()
//     .max(12)
//     .regex(/^[A-Z][a-z]+$/)
//     .required()
//     .messages({
//       'string.pattern.base':
//         '{#label} must start with a capital letter and only contain alphabetic characters',
//       'any.required': 'First name is required',
//     }),
//   middleName: Joi.string().trim().allow(''),
//   lastName: Joi.string()
//     .trim()
//     .regex(/^[a-zA-Z\s'-]+$/)
//     .required()
//     .messages({
//       'string.pattern.base':
//         '{#label} is not valid. Only alphabetic characters, spaces, hyphens, and apostrophes are allowed',
//       'any.required': 'Last name is required',
//     }),
// });

// // Joi Schema for LocalGuardian
// const LocalGuardianSchema = Joi.object({
//   name: Joi.string().trim().required().messages({
//     'any.required': "Local guardian's name is required",
//   }),
//   occupation: Joi.string().trim().required().messages({
//     'any.required': "Local guardian's occupation is required",
//   }),
//   contactNo: Joi.string().trim().required().messages({
//     'any.required': "Local guardian's contact number is required",
//   }),
//   address: Joi.string().trim().required().messages({
//     'any.required': "Local guardian's address is required",
//   }),
// });

// // Joi Schema for Student
// const StudentValidationSchema = Joi.object({
//   id: Joi.string().trim().required().messages({
//     'any.required': 'Student ID is required',
//   }),
//   name: UserNameSchema.required().messages({
//     'any.required': "Student's name is required",
//   }),
//   gender: Joi.string().valid('male', 'female', 'other').required().messages({
//     'any.only': '{#value} is not supported',
//     'any.required': 'Gender is required',
//   }),
//   dateOfBirth: Joi.string().trim().required().messages({
//     'any.required': 'Date of birth is required',
//   }),
//   email: Joi.string().trim().email().required().messages({
//     'string.email': '{#value} is not a valid email type',
//     'any.required': 'Email is required',
//   }),
//   contactNo: Joi.string().trim().required().messages({
//     'any.required': 'Contact number is required',
//   }),
//   emergencyContactNo: Joi.string().trim().required().messages({
//     'any.required': 'Emergency contact number is required',
//   }),
//   bloodGroup: Joi.string()
//     .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
//     .required()
//     .messages({
//       'any.required': 'Blood group is required',
//     }),
//   presentAddress: Joi.string().trim().required().messages({
//     'any.required': 'Present address is required',
//   }),
//   permanentAddress: Joi.string().trim().required().messages({
//     'any.required': 'Permanent address is required',
//   }),
//   guardian: GuardianSchema.required().messages({
//     'any.required': 'Guardian details are required',
//   }),
//   localGuardian: LocalGuardianSchema.required().messages({
//     'any.required': 'Local guardian details are required',
//   }),
//   profileImage: Joi.string().trim().optional(),
//   isActive: Joi.string()
//     .valid('active', 'blocked')
//     .default('active')
//     .required()
//     .messages({
//       'any.required': 'Active status is required',
//     }),
// });

// export default StudentValidationSchema;

import { z } from 'zod';

// Zod Schema for Guardian
const GuardianSchema = z.object({
  fatherName: z
    .string()
    .min(1, "Father's name is required")
    .transform((val) => val.trim()),
  fatherOccupation: z
    .string()
    .min(1, "Father's occupation is required")
    .transform((val) => val.trim()),
  fatherContactNo: z
    .string()
    .min(1, "Father's contact number is required")
    .transform((val) => val.trim()),
  motherName: z
    .string()
    .min(1, "Mother's name is required")
    .transform((val) => val.trim()),
  motherOccupation: z
    .string()
    .min(1, "Mother's occupation is required")
    .transform((val) => val.trim()),
  motherContactNo: z
    .string()
    .min(1, "Mother's contact number is required")
    .transform((val) => val.trim()),
});

// Zod Schema for UserName
const UserNameSchema = z.object({
  firstName: z
    .string()
    .max(12, 'First name must be at most 12 characters long')
    .regex(/^[A-Z][a-z]+$/, '{value} is not in capitalize format')
    .transform((val) => val.trim()),
  middleName: z
    .string()
    .optional()
    .transform((val) => val?.trim() || ''),
  lastName: z
    .string()
    .regex(/^[a-zA-Z\s'-]+$/, '{value} is not valid')
    .min(1, 'Last name is required')
    .transform((val) => val.trim()),
});

// Zod Schema for LocalGuardian
const LocalGuardianSchema = z.object({
  name: z
    .string()
    .min(1, "Local guardian's name is required")
    .transform((val) => val.trim()),
  occupation: z
    .string()
    .min(1, "Local guardian's occupation is required")
    .transform((val) => val.trim()),
  contactNo: z
    .string()
    .min(1, "Local guardian's contact number is required")
    .transform((val) => val.trim()),
  address: z
    .string()
    .min(1, "Local guardian's address is required")
    .transform((val) => val.trim()),
});

const StudentValidationSchema = z.object({
  id: z
    .string()
    .min(1, 'Student ID is required')
    .transform((val) => val.trim()),
  password: z
    .string()
    .max(20, 'Student password is required')
    .transform((val) => val.trim()),
  name: UserNameSchema,
  gender: z
    .enum(['male', 'female', 'other'])
    .refine((val) => ['male', 'female', 'other'].includes(val), {
      message: '{value} is not supported',
    }),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .transform((val) => val.trim()),
  email: z
    .string()
    .email('{value} is not a valid email type')
    .transform((val) => val.trim()),
  contactNo: z
    .string()
    .min(1, 'Contact number is required')
    .transform((val) => val.trim()),
  emergencyContactNo: z
    .string()
    .min(1, 'Emergency contact number is required')
    .transform((val) => val.trim()),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    required_error: 'Blood group is required',
  }),
  presentAddress: z
    .string()
    .min(1, 'Present address is required')
    .transform((val) => val.trim()),
  permanentAddress: z
    .string()
    .min(1, 'Permanent address is required')
    .transform((val) => val.trim()),
  guardian: GuardianSchema,
  localGuardian: LocalGuardianSchema,
  profileImage: z
    .string()
    .optional()
    .transform((val) => val?.trim() || ''),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean(),
});

export default StudentValidationSchema;
