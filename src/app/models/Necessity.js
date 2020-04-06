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
    location: {
      type: PointSchema,
      index: '2dsphere',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Necessity', NecessitySchema);
