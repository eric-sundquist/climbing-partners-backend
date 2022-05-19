/**
 * Module for the Messages Controller.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */
import { Message } from '../models/message.js'

/**
 * Encapsulates a controller.
 */
export class MessagesController {
  /**
   * Creates a new message.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createMessage (req, res, next) {
    try {
      const message = new Message({
        chatId: req.body.chatId,
        fromUser: req.body.fromUser,
        text: req.body.text
      })

      await message.save()

      res.status(201).json(message)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Gets the all messages with the chatId.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getMessagesForChat (req, res, next) {
    try {
      const messages = await Message.find({
        chatId: req.params.chatId
      })

      res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  }
}
