import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema(
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
    activated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Login', LoginSchema);
