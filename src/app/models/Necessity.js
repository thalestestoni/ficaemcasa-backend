import mongoose from 'mongoose';

const PointSchema = require('./utils/PointSchema');

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    necessity: {
      type: [String],
      required: true,
    },
    attended: {
      type: Boolean,
      required: true,
      default: false,
    },
    location: {
      type: PointSchema,
      index: '2dsphere',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
