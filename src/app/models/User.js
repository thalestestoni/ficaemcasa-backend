import mongoose from 'mongoose';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const PointSchema = require('./utils/PointSchema');

const s3 = new aws.S3();

const UserSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
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
    },
    email: {
      type: String,
      required: false,
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
    useTermsRead: {
      type: Boolean,
      required: true,
    },
    lastNotificationPendingCategories: {
      type: Date,
      default: new Date(),
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
