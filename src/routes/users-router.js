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

// Provide req.user to the route if :userId is present in the route path.
router.param('userId', (req, res, next, userId) => controller.loadUserData(req, res, next, userId))

// Create user
router.post('/',
  (req, res, next) => controller.create(req, res, next)
)

// GET user profile (Public for auth users)
router.get('/:userId/profile',
  (req, res, next) => controller.getProfile(req, res, next)
)

// update user profile
router.put('/:userId/profile',
  authOwner,
  (req, res, next) => controller.updateProfile(req, res, next)
)

// GET user
router.get('/:userId',
  authOwner,
  (req, res, next) => controller.getUser(req, res, next)
)

// ----- user -> partner ad ------

// Provide req.partnerAd to the route if :adId is present in the route path.
router.param('adId', (req, res, next, adId) => controller.loadAdData(req, res, next, adId))

// Create partner ad
router.post('/:userId/partner-ad',
  authOwner,
  (req, res, next) => controller.createPartnerAd(req, res, next)
)

// Get all of the users partnerAds
router.get('/:userId/partner-ad',
  authOwner,
  (req, res, next) => controller.getAllPartnerAds(req, res, next)
)

// Get partner ad
router.get('/:userId/partner-ad/:adId',
  authOwner,
  (req, res, next) => controller.getPartnerAd(req, res, next)
)
// Delete a partner ad
router.delete('/:userId/partner-ad/:adId',
  authOwner,
  (req, res, next) => controller.deletePartnerAd(req, res, next)
)

// ----- user -> invites ------

// Create invite
router.post('/:userId/invites',
  (req, res, next) => controller.createInvite(req, res, next)
)

// Delete invite
router.delete('/:userId/invites/:inviteId',
  (req, res, next) => controller.deleteInvite(req, res, next)
)

// Create a new session
router.post('/:userId/sessions',
  (req, res, next) => controller.createSession(req, res, next)
)
