/**
 * Module for partner ads routing.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import { authOwner } from './auth-owner.js'
import { PartnerAdsController } from '../controllers/partner-ads-controller.js'

export const router = express.Router()

const controller = new PartnerAdsController()

// Provide req.partnerAd to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadPartnerAdData(req, res, next, id))

// Create a search
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
