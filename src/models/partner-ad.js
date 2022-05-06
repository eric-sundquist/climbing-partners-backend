/**
 * Mongoose model find partner ad.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import mongoose from 'mongoose'

export const partnerAd = new mongoose.Schema({
  uidOwner: {
    type: String,
    required: [true, 'Assingning a user id is required']
  },
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
  timestamps: true
})

export const PartnerAd = mongoose.model('PartnerAd', partnerAd)
