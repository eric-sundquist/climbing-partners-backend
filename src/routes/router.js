/**
 * API version 1 routes.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as imagesRouter } from './images-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Climbing partner API!' }))
router.use('/images', imagesRouter)

// Catch 404.
router.use('*', (req, res, next) => next(createError(404)))
