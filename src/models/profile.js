/**
 * Mongoose model Profile.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [1, 'The description must be of minimum length 1 characters.'],
    maxLength: [256, 'The description must be of maximum length 256 characters.'],
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    minLength: [1, 'The description must be of minimum length 1 characters.'],
    maxLength: [256, 'The description must be of maximum length 256 characters.'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    minLength: [1, 'The description must be of minimum length 1 characters.'],
    maxLength: [256, 'The description must be of maximum length 256 characters.']
  },
  ownerUid: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret.__v
      delete ret._id
      delete ret.ownerUid
    }
  }
})

// Create a model using the schema.
export const Profile = mongoose.model('Profile', schema)
