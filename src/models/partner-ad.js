/**
 * Mongoose model find partner ad.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import mongoose from 'mongoose'

export const partnerAd = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, 'Assingning a user id is required']
  },
  date: {
    type: Date,
    required: [true, 'Assigning a date is required']
  },
  location: {
    type: String,
    required: [true, 'Assigning a location is required']
  },
  disciplines: [{ discipline: String, grade: String }],
  equipment: Boolean,
  transport: Boolean
}, {
  timestamps: true
})

export const PartnerAd = mongoose.model('partnerAd', partnerAd)
