/**
 * Module for the PartnerAdsController Controller.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */
import createError from 'http-errors'
import { PartnerAd } from '../models/partner-ad.js'

/**
 * Encapsulates a controller.
 */
export class PartnerAdsController {
  /**
   * Provide req.user to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the User data to load.
   */
  async loadPartnerAdData (req, res, next, id) {
    try {
      // Get the ad.
      const partnerAd = await PartnerAd.findById(id)

      // If no search found send a 404 (Not Found).
      if (!partnerAd) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the image to req.
      req.partnerAd = partnerAd

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response requested user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    res.json(req.user)
  }

  /**
   * Send JSON response, requested user profile.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getProfile (req, res, next) {
    res
      .status(200)
      .json(req.user.profile)
  }

  /**
   * Creates a new ad.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const ad = new PartnerAd({
        uid: req.body.uid,
        date: req.body.date,
        location: req.body.location,
        disciplines: req.body.disciplines
      })
      await ad.save()
      res
        .status(201)
        .json(ad)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates some of a specific user resource. Overwrites old data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updateProfile (req, res, next) {
    try {
      req.user.profile.name = req.body.name
      req.user.profile.description = req.body.description
      req.user.profile.disciplines = req.body.disciplines

      await req.user.save()
      console.log('körs')
      res
        .status(200)
        .json(req.user)
    } catch (error) {
      next(error)
    }
  }
}
