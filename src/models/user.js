/**
 * Mongoose model User.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { profile } from './profile.js'

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
  timestamps: true
})

export const User = mongoose.model('User', schema)
