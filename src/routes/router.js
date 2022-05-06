/**
 * API version 1 routes.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as usersRouter } from './users-router.js'
import { router as partnerAdsRouter } from './partner-ads-router.js'
import { firebase } from '../config/firebase.js'

export const router = express.Router()

/**
 * Authenticates requests.
 *
 * If authentication is successful, `req.auth`is populated and the
 * request is authorized to continue.
 * If authentication fails, an unauthorized response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async function authenticateJWT (req, res, next) {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    const decodedToken = await firebase.auth().verifyIdToken(token)
    req.uid = decodedToken.sub

    next()
  } catch (err) {
    const error = createError(401, 'Access token invalid or not provided.')
    error.cause = err
    next(error)
  }
}

router.get('/', (req, res) => res.json({ message: 'Welcome Climbing partner API! All other routes requires authentication.' }))

router.use('/users',
  authenticateJWT,
  usersRouter)

router.use('/partner-search',
  authenticateJWT,
  partnerAdsRouter)

// Catch 404.
router.use('*', (req, res, next) => next(createError(404)))
