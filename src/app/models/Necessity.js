import mongoose from 'mongoose';

const PointSchema = require('./utils/PointSchema');

const NecessitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    childrens: {
      type: Number,
      required: true,
    },
    necessities: {
      type: [String],
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: PointSchema,
      index: '2dsphere',
    },
    attended: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Necessity', NecessitySchema);
