/**
 * API version 1 routes.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { UsersController } from '../controllers/api/users-controller.js'

export const router = express.Router()

const controller = new UsersController()

/**
 * Verifies that the user trying to reach a resource is the owner.
 *
 * If authentication fails, an 403 - forbidden response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authOwner = (req, res, next) => {
  if (req.uid !== req.user._id) {
    const error = createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.')
    next(error)
    return
  }
  next()
}

//  Routes
// ---------------

// Provide req.user to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadUserData(req, res, next, id))

// Create user
router.post('/',
  (req, res, next) => controller.create(req, res, next)
)

// GET user profile (Public)
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
