import mongoose from 'mongoose';

const PointSchema = require('./utils/PointSchema');

const AssistSchema = new mongoose.Schema(
  {
    category: { type: String, require: true },
    note: { type: String, required: false },
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

export default mongoose.model('Assist', AssistSchema);
