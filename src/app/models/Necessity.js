import mongoose from 'mongoose';

const PointSchema = require('./utils/PointSchema');

const NecessitySchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: false,
    },
    unitMeasure: {
      type: String,
      required: false,
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
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Necessity', NecessitySchema);
