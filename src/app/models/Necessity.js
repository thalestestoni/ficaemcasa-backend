import mongoose from 'mongoose';

const PointSchema = require('./utils/PointSchema');

const NecessitySchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
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

export default mongoose.model('Necessity', NecessitySchema);
