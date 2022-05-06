/**
 * Mongoose model Profile.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
export const profile = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [256, 'The name must be of maximum length 256 characters.'],
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    maxLength: [2048, 'The description must be of maximum length 2048 characters.'],
    default: ''
  },
  disciplines: [{ discipline: String, grade: String }]
}, {
  timestamps: true
})
