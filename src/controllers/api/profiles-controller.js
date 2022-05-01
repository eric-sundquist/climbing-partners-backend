/**
 * Module for the TasksController.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */
import createError from 'http-errors'
import fetch from 'node-fetch'
import { Profile } from '../../models/profile.js'

/**
 * Encapsulates a controller.
 */
export class ProfilesController {
  /**
   * Provide req.profile to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the profile data to load.
   */
  async loadProfileData (req, res, next, id) {
    try {
      // Get the image.
      const profile = await Profile.findById(id)

      // If no image found send a 404 (Not Found).
      if (!profile) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the image to req.
      req.profile = profile

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a profile.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    res.json(req.profile)
  }

  /**
   * Sends a JSON response containing all profile created by the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const images = await Image.find({ ownerUserId: req.user.userId })
      res.json(images)
    } catch (error) {
      next(error)
    }
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
      if (!req.body.data) {
        next(createError(400, 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'))
        return
      }

      const body = {
        data: req.body.data,
        contentType: req.body.contentType
      }

      // Save URL and image data in database
      const image = new Image({
        imageUrl: data.imageUrl,
        description: req.body.description,
        location: req.body.location,
        _id: data.id,
        ownerUserId: req.user.userId
      })
      await image.save()
      res
        .status(201)
        .json(image)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a everything in a specific image called with PUT http method.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updatePut (req, res, next) {
    try {
      if (!this.isAllowedContentType(req, res, next)) return
      if (!req.body.data) {
        next(createError(400, 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'))
        return
      }

      const body = {
        data: req.body.data,
        contentType: req.body.contentType
      }

      await this.fetchPictureApi('PUT', `images/${req.params.id}`, body)

      req.image.description = req.body.description
      req.image.location = req.body.location

      await req.image.save()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates some of a specific image resource called with PATCH http method.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updatePatch (req, res, next) {
    try {
      for (const property of Object.keys(req.body)) {
        if (property === 'description' || property === 'location') {
          req.image[property] = req.body[property]
        } else if (property === 'data') {
          await this.fetchPictureApi('PATCH', `images/${req.params.id}`, { data: req.body.data })
        } else if (property === 'contentType') {
          this.isAllowedContentType(req, res, next)
          await this.fetchPictureApi('PATCH', `images/${req.params.id}`, { contentType: req.body.contentType })
        }
      }

      await req.image.save()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes the specified image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await this.fetchPictureApi('DELETE', `images/${req.params.id}`)
      await req.image.deleteOne()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Send http request to Picture it api.
   *
   * @param {string} method  - which http method to use.
   * @param {string} route - set url route.
   * @param {object} body - body to send as json.
   */
  async fetchPictureApi (method, route, body) {
    const response = await fetch(`https://courselab.lnu.se/picture-it/images/api/v1/${route}`, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'X-API-Private-Token': process.env.PICTURE_IT_ACCESS_TOKEN
      }
    })
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText} - Fetch from Picture-It API failed`)
    }

    return response
  }

  /**
   * Checks if content type is allowed.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {boolean} is content type allowed, true/false.
   */
  isAllowedContentType (req, res, next) {
    const allowedContentTypes = ['image/gif', 'image/jpeg', 'image/png']
    console.log('jek')
    if (!(allowedContentTypes.some(element => element === req.body.contentType))) {
      next(createError(400, 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'))
      return false
    }
    return true
  }
}
