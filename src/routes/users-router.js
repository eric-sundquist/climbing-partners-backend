/**
 * API version 1 routes.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import { authOwner } from './auth-owner.js'
import { UsersController } from '../controllers/users-controller.js'

export const router = express.Router()

const controller = new UsersController()

// Provide req.user to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadUserData(req, res, next, id))

// Create user
router.post('/',
  (req, res, next) => controller.create(req, res, next)
)

// GET user profile (Public for auth users)
router.get('/:id/profile',
  (req, res, next) => controller.getProfile(req, res, next)
)

// update user profile
router.put('/:id/profile',
  authOwner,
  (req, res, next) => controller.updateProfile(req, res, next)
)

// GET user
router.get('/:id',
  authOwner,
  (req, res, next) => controller.find(req, res, next)
)
