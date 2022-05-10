/**
 * Mongoose model find partner ad.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import mongoose from 'mongoose'

export const partnerAd = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: {
    type: Date,
    required: [true, 'Assigning a date is required']
  },
  location: {
    type: String,
    required: [true, 'Assigning a location is required'],
    maxLength: [512, 'The location must be of maximum length 512 characters.']

  },
  description: {
    type: String,
    maxLength: [2048, 'The description must be of maximum length 2048 characters.']
  },
  disciplines: [{ discipline: String, grade: String }],
  equipment: Boolean,
  transport: Boolean
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

partnerAd.virtual('id').get(function () {
  return this._id.toHexString()
})

export const PartnerAd = mongoose.model('PartnerAd', partnerAd)
