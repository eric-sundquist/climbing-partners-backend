/**
 * Module for partner ads routing.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import { PartnerAdsController } from '../controllers/partner-ads-controller.js'

export const router = express.Router()

const controller = new PartnerAdsController()

// Provide req.partnerAd to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadPartnerAdData(req, res, next, id))

// GET all partner ads
router.get('/',
  (req, res, next) => controller.findAll(req, res, next)
)
// Get a partner ad
router.get('/:id',
  (req, res, next) => controller.find(req, res, next)
)
