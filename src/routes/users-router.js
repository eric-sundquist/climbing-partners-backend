/**
 * API version 1 routes.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import { authOwner } from './auth-owner.js'
import { UsersController } from '../controllers/users-controller.js'

/*
  Lägg till nya partner ad funktioner i controllern. Skapa partner ad med population.
  https://mongoosejs.com/docs/populate.html
  https://www.youtube.com/watch?v=kjKR0q8EBKE
*/

export const router = express.Router()

const controller = new UsersController()

// Provide req.user to the route if :userId is present in the route path.
router.param('userId', (req, res, next, userId) => controller.loadUserData(req, res, next, userId))

// Provide req.partnerAd to the route if :adId is present in the route path.
router.param('adId', (req, res, next, adId) => controller.loadAdData(req, res, next, adId))

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
