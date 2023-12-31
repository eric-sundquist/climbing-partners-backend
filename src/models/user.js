/**
 * Mongoose model User.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import { mongoose } from 'mongoose'
import { profile } from './profile.js'

const userSchema = new mongoose.Schema({
  uid: {
    type: String
  },
  profile: {
    type: profile,
    default: {}
  },
  partners: [mongoose.ObjectId],
  invites: [{
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fromAd: { type: mongoose.Schema.Types.ObjectId, ref: 'PartnerAd' },
    ad: { type: mongoose.Schema.Types.ObjectId, ref: 'PartnerAd' }
  }],
  sessions: [{
    withUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: String,
    date: Date,
    description: String
  }],
  ads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PartnerAd' }]
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

userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
export const User = mongoose.model('User', userSchema)
