import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    isNeedy: {
      type: Boolean,
      required: true,
    },
    sons: {
      type: Number,
      required: false,
    },
    sonsAverageAge: {
      type: String,
      required: false,
    },
    sonsAtHome: {
      type: Number,
      required: false,
    },
    birthday: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
