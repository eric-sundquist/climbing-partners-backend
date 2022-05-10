/**
 * Module for the User Controller.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */
import createError from 'http-errors'
import { User } from '../models/user.js'
import { PartnerAd } from '../models/partner-ad.js'

/**
 * Encapsulates a controller.
 */
export class UsersController {
  /**
   * Provide req.user to the route if :userId is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} userId - The value of the id for the User data to load.
   */
  async loadUserData (req, res, next, userId) {
    try {
      // Get the user.
      const user = await User.findOne({ uid: userId })

      // If no image found send a 404 (Not Found).
      if (!user) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the image to req.
      req.user = user

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Provide req.partnerAd to the route if :adId is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} adId - The value of the id for the User data to load.
   */
  async loadAdData (req, res, next, adId) {
    try {
      // Get the user.
      const ad = await PartnerAd.findById(adId)

      // If no image found send a 404 (Not Found).
      if (!ad) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the image to req.
      req.partnerAd = ad

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
  async getUser (req, res, next) {
    const user = await req.user.populate('ads')
    res.json(user)
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
   * Creates a new profile.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const user = new User({ uid: req.uid })
      await user.save()
      res
        .status(201)
        .json(user)
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
      res
        .status(200)
        .json(req.user.profile)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a partner ad for user. Ad is sent as response.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createPartnerAd (req, res, next) {
    try {
      const ad = new PartnerAd({
        owner: req.user._id,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        disciplines: req.body.disciplines,
        equipment: req.body.equipment,
        transport: req.body.transport
      })
      await ad.save()

      req.user.ads.push(ad)
      await req.user.save()

      res
        .status(201)
        .json(ad)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Finds all partner ads and sends them in response.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllPartnerAds (req, res, next) {
    try {
      const user = await req.user.populate('ads')

      res
        .status(200)
        .json(user.ads)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Finds a partner ad and sends it in response.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getPartnerAd (req, res, next) {
    res.status(200).json(req.partnerAd)
  }

  /**
   * Delete partner ad.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deletePartnerAd (req, res, next) {
    try {
      await PartnerAd.findByIdAndDelete(req.params.adId)
      req.user.ads = req.user.ads.filter(adObjectId => adObjectId.valueOf() !== req.params.adId)

      await req.user.save()

      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}
