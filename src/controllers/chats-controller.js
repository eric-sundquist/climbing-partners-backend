/**
 * Module for the Chats Controller.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */
import createError from 'http-errors'
import { Chat } from '../models/chat'

/**
 * Encapsulates a controller.
 */
export class ChatsController {
  /**
   * Creates a new chat.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createChat (req, res, next) {
    try {
      const chat = new Chat({
        users: [req.body.fromUserId, req.body.toUserId]
      })

      await chat.save()

      res.status(201).json(chat)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Gets the requested chat.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getChat (req, res, next) {
    try {
      const chat = await Chat.find({
        members: { $in: [req.params.userId] }
      })

      if (!chat) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      res.status(200).json(chat)
    } catch (error) {
      next(error)
    }
  }
}
