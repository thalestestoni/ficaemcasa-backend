import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    sons: {
      type: Number,
      required: false,
    },
    sons_age_range: {
      type: String,
      required: false,
    },
    sons_in_home: {
      type: Number,
      required: false,
    },
    birthday: {
      type: String,
      required: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
