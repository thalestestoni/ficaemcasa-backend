import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import Phone from './Phone';

const PointSchema = require('./utils/PointSchema');

const s3 = new aws.S3();

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    isNeedy: {
      type: Boolean,
      required: true,
    },
    sonsQuantity: {
      type: Number,
      required: false,
    },
    sonsAverageAge: {
      type: Number,
      required: false,
    },
    sonsAtHome: {
      type: Number,
      required: false,
    },
    birthday: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    avatar: {
      name: String,
      size: Number,
      key: String,
      url: String,
    },
    location: {
      type: PointSchema,
      index: '2dsphere',
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  try {
    const password_hash = await bcrypt.hash(this.password, 8);
    this.password = password_hash;
  } catch (error) {
    return error;
  }
});

UserSchema.pre('save', async function () {
  try {
    await Phone.findOneAndRemove({ phone: this.phone });
  } catch (error) {
    return error;
  }
});

/** Remove foto de perfil na Amazon S3 */
UserSchema.pre('remove', function () {
  if (this.avatar.key && process.env.STORAGE_TYPE === 's3') {
    return s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: this.avatar.key,
      })
      .promise();
  }
  return promisify(fs.unlink)(
    path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', this.avatar.key)
  );
});

export default mongoose.model('User', UserSchema);
