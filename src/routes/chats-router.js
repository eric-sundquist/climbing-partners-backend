/**
 * Module for chats routing.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import { ChatsController } from '../controllers/chats-controller.js'

export const router = express.Router()

const controller = new ChatsController()

// Create new chat
router.post('/',
  (req, res, next) => controller.createChat(req, res, next)
)

// GET all partner ads
router.get('/',
  (req, res, next) => controller.getChat(req, res, next)
)
