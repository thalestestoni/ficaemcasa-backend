import mongoose from 'mongoose';

const PointSchema = require('./utils/PointSchema');

const NecessitySchema = new mongoose.Schema(
  {
    necessities: {
      type: [{ category: String, necessity: String, quantity: String }],
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
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
