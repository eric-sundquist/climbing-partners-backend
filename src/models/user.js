/**
 * Mongoose model User.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { profile } from './profile.js'

// Create a schema.
const schema = new mongoose.Schema({
  _id: {
    type: String
  },
  profile: {
    type: profile,
    default: {}
  },
  partners: [{ partner: mongoose.ObjectId }],
  searches: [{ search: mongoose.ObjectId }]
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
    }
  }
})

// Create a model using the schema.
export const User = mongoose.model('User', schema)
