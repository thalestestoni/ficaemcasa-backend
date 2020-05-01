import mongoose from 'mongoose';

const SignupSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    tokenExpires: {
      type: Date,
      required: true,
      index: { expires: '30m' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Signup', SignupSchema);
