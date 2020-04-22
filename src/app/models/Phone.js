import mongoose from 'mongoose';

const PhoneSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    tokenExpires: {
      type: Date,
      required: true,
    },
    activated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Phone', PhoneSchema);
