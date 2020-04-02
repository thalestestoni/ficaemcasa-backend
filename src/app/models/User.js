import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
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
    necessities: [
      {
        necessitiesList: [String],
        location: {
          type: PointSchema,
          index: '2dsphere',
        },
      },
    ],
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
1;
