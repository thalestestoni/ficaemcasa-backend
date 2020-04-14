import mongoose from 'mongoose';

const PointSchema = require('./utils/PointSchema');

const AssistSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    userId: { type: mongoose.ObjectId, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    userLocation: {
      type: PointSchema,
      index: '2dsphere',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Assist', AssistSchema);
