import mongoose from 'mongoose';

const PointSchema = require('./utils/PointSchema');

const NecessitySchema = new mongoose.Schema(
  {
    necessities: {
      category: { type: String, require: true },
      items: [
        {
          item: { type: String, require: true },
          quantity: { type: Number, require: true },
          unitMeasure: { type: String, require: false },
        },
      ],
      status: { type: String, require: true, default: 'available' },
    },
    user: {
      userId: { type: mongoose.ObjectId, require: true },
      name: { type: String, require: true },
      phone: { type: String, require: true },
      location: {
        type: PointSchema,
        index: '2dsphere',
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Necessity', NecessitySchema);
