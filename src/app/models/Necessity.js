import mongoose from 'mongoose';

const NecessitySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    measureUnit: { type: String, required: false },
    status: { type: String, required: false, default: 'available' },
    userId: { type: mongoose.ObjectId, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Necessity', NecessitySchema);
