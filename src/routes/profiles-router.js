/**
 * API version 1 routes.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { ProfilesController } from '../controllers/api/profiles-controller.js'
import { firebase } from '../config/firebase.js'

export const router = express.Router()

const controller = new ProfilesController()

/**
 * Authenticates requests.
 *
 * If authentication is successful, `req.user`is populated and the
 * request is authorized to continue.
 * If authentication fails, an unauthorized response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticateJWT = (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    firebase.auth().verifyIdToken(token).then((decodedToken) => {
      req.user = {
        uid: decodedToken.sub
      }
    })
    next()
  } catch (err) {
    const error = createError(401, 'Access token invalid or not provided.')
    error.cause = err
    next(error)
  }
}

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
  if (req.user.uid !== req.profile.ownerUid) {
    const error = createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.')
    next(error)
    return
  }
  next()
}

//  Routes
// ---------------

// Provide req.profile to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadProfileData(req, res, next, id))

router.get('/test',
  (req, res, next) => {
    res.json('Beep boop. Testing testing.')
  }
)

router.get('/test/protected',
  authenticateJWT,
  (req, res, next) => {
    res.json('Oh wow! Much PROTECED. NEEDS AUTH! Beep boop. Testing testing.')
  }
)

router.get('/',
  // authenticateJWT,
  (req, res, next) => controller.findAll(req, res, next)
)

// GET profile/:id
router.get('/:id',
  authenticateJWT,
  authOwner,
  (req, res, next) => controller.find(req, res, next)
)

// POST images
router.post('/',
  authenticateJWT,
  (req, res, next) => controller.create(req, res, next)
)

// PUT images/:id
router.put('/:id',
  authenticateJWT,
  authOwner,
  (req, res, next) => controller.updatePut(req, res, next)
)

// PATCH images/:id
router.patch('/:id',
  authenticateJWT,
  authOwner,
  (req, res, next) => controller.updatePatch(req, res, next)
)

// DELETE images/:id
router.delete('/:id',
  authenticateJWT,
  authOwner,
  (req, res, next) => controller.delete(req, res, next)
)
