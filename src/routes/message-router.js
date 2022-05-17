/**
 * Module for message routing.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import { MessagesController } from '../controllers/messages-controller.js'

export const router = express.Router()

const controller = new MessagesController()

// Create new chat
router.post('/',
  (req, res, next) => controller.createMessage(req, res, next)
)

// GET all messages for attached to chatId
router.get('/chatId',
  (req, res, next) => controller.getMessagesForChat(req, res, next)
)
