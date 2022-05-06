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
   * Creates a new ad.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const ad = new PartnerAd({
        uidOwner: req.body.uid,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        disciplines: req.body.disciplines,
        transport: req.body.transport,
        equipment: req.body.equipment
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
   * Updates a partner ad.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      req.partnerAd.date = req.body.date
      req.partnerAd.location = req.body.location
      req.partnerAd.description = req.body.description
      req.partnerAd.disciplines = req.body.disciplines
      req.partnerAd.transport = req.body.transport
      req.partnerAd.equipment = req.body.equipment

      await req.partnerAd.save()

      res
        .status(200)
        .json(req.user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes the specified partner Ad.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await req.partnerAd.deleteOne()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
