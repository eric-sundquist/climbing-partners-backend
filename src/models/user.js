/**
 * Mongoose model User.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import { mongoose } from 'mongoose'
import { profile } from './profile.js'

const schema = new mongoose.Schema({
  _id: {
    type: String
  },
  profile: {
    type: profile,
    default: {}
  },
  partners: [mongoose.ObjectId],
  ads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PartnerAd' }]
}, {
  timestamps: true
})

export const User = mongoose.model('User', schema)
