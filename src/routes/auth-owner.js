/**
 * Auth owner module.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import createError from 'http-errors'

/**
 * Verifies that the user trying to reach a resource is the owner.
 *
 * If authentication fails, an 403 - forbidden response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authOwner = (req, res, next) => {
  if (req.uid !== req.user.uid) {
    const error = createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.')
    next(error)
    return
  }
  next()
}
