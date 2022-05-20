/**
 * Module for the Chats Controller.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */
import { Chat } from '../models/chat.js'

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
        users: [req.body.fromUserId, req.body.toUserId],
        userIds: [req.body.fromUserId, req.body.toUserId]
      })

      await chat.save()

      await chat.populate('users')

      res.status(201).json(chat)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Gets the requested chats connected to a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getChats (req, res, next) {
    try {
      const chats = await Chat.find({ userIds: req.params.userId }).populate('users')

      res.status(200).json(chats)
    } catch (error) {
      next(error)
    }
  }
}
