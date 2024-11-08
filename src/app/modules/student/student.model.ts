import { model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import config from '../../config';

const GuardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, "Father's name is required"],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, "Father's occupation is required"],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father's contact number is required"],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required"],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, "Mother's occupation is required"],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, "Mother's contact number is required"],
    trim: true,
  },
});

const UserNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    validate: {
      validator: function (value: string) {
        const firstNameStr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return firstNameStr === value;
      },
      message: `{VALUE} is not in capitalize format`,
    },
    maxlength: 12,
    required: [true, 'First name is required'],
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    validate: {
      validator: (value: string) =>
        validator.isAlpha(value, 'en-US', { ignore: ' ' }),
      message: `{VALUE} is not valid`,
    },
    required: [true, 'Last name is required'],
    trim: true,
  },
});

const LocalGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, "Local guardian's name is required"],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, "Local guardian's occupation is required"],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, "Local guardian's contact number is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Local guardian's address is required"],
    trim: true,
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    unique: true,
    ref: 'User',
  },
  name: {
    type: UserNameSchema,
    required: [true, "Student's name is required"],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not supported',
    },
    required: [true, 'Gender is required'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    trim: true,
  },
  email: {
    type: String,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: `{VALUE} is not a valid email type`,
    },
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Blood group is required'],
    trim: true,
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required'],
    trim: true,
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
    trim: true,
  },
  guardian: {
    type: GuardianSchema,
    required: [true, 'Guardian details are required'],
  },
  localGuardian: {
    type: LocalGuardianSchema,
    required: [true, 'Local guardian details are required'],
  },
  profileImage: {
    type: String,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

//virtual
// Create a virtual field for full name
UserNameSchema.virtual('fullName')
  .get(function () {
    return [this.firstName, this.middleName, this.lastName]
      .filter((name) => name)
      .join(' ');
  })
  .set(function (fullName) {
    // Split the full name into an array
    const nameParts = fullName.trim().split(' ');

    // Assign firstName, middleName, and lastName based on the number of name parts
    this.firstName = nameParts[0];
    this.middleName = nameParts.length === 3 ? nameParts[1] : '';
    this.lastName = nameParts.length === 3 ? nameParts[2] : nameParts[1];
  });

// Ensure virtuals are included when converting documents to JSON
UserNameSchema.set('toJSON', { virtuals: true });
UserNameSchema.set('toObject', { virtuals: true });

// pre save middleware / hook : will work on create() save()

// Pre-save hook to hash password
studentSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(Number(config.bcrypt_salt_rounds));
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Post-save hook to remove password field from the returned document
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

//query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      isDeleted: {
        $ne: true,
      },
    },
  });
  next();
});

// // Adding a method to compare password for login
// studentSchema.methods.comparePassword = async function (
//   candidatePassword: any,
// ) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// studentSchema.pre('save', function () {
//   console.log(this, 'pre hook : we will save to data');
// });

// studentSchema.post('save', function () {
//   console.log(this, 'pre hook : we saved our data');
// });

// studentSchema.methods.isUserExits = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

studentSchema.statics.isUserExits = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
