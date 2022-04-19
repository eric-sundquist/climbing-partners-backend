/**
 * Mongoose model Image.
 *
 * @author Eric Sundqvist
 * @author Mats Loock
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import validator from 'validator'

const { isURL } = validator

// Create a schema.
const schema = new mongoose.Schema({
  _id: {
    type: String
  },
  imageUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [isURL, 'Please provide a valid URL.']
  },
  description: {
    type: String,
    trim: true,
    minLength: [1, 'The description must be of minimum length 1 characters.'],
    maxLength: [256, 'The description must be of maximum length 256 characters.']
  },
  location: {
    type: String,
    trim: true,
    minLength: [1, 'The location name must be of minimum length 1 characters.'],
    maxLength: [256, 'The location name must be of maximum length 256 characters.']
  },
  ownerUserId: {
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
      delete ret.ownerUserId
    }
  }
})

// Create a model using the schema.
export const Image = mongoose.model('Image', schema)
