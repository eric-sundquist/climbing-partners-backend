/**
 * Mongoose model for messages.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  chatId: {
    type: String
  },
  fromUser: {
    type: String
  },
  text: {
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
    }
  }
})

messageSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const Message = mongoose.model('Message', messageSchema)
