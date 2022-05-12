/**
 * Module for the PartnerAdsController Controller.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */
import createError from 'http-errors'
import { endOfDay, startOfDay } from 'date-fns'
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
   * Sends a JSON response with requested partner ad.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    res
      .status(200)
      .json(req.partnerAd)
  }

  /**
   * Sends a JSON response with requested partner ad.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const ads = await PartnerAd.find()

      res
        .status(200)
        .json(ads)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Filters partner ads by query supplied query string. Sends found ads in response.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async filter (req, res, next) {
    try {
      const date = new Date(req.query.date)
      const ads = await PartnerAd.find({
        location: req.query.location,
        date: {
          $gte: startOfDay(date),
          $lte: endOfDay(date)
        }
      }).populate('owner')

      res
        .status(200)
        .json(ads)
    } catch (error) {
      next(error)
    }
  }
}
