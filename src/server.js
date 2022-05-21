/**
 * The starting point of the application.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { SessionStore } from './SessionStore.js'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import cors from 'cors'

try {
  await connectDB()

  const app = express()

  app.use(helmet())

  app.use(cors({ origin: process.env.CLIENT_URL }))

  app.use(logger('dev'))

  app.use(express.json())

  // Register routes.
  app.use('/', router)

  // Setup websocket server
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.CLIENT_URL]
    }
  })
  const sessions = new SessionStore()

  io.on('connection', (socket) => {
    socket.on('add-user', (uid) => {
      console.log(uid)
      sessions.saveSession(uid, socket.id)
    })

    socket.on('send-message', ({ senderUid, receiverUid, text }) => {
      const user = sessions.findSession(receiverUid)
      if (user) {
        io.to(user.socketId).emit('get-message', {
          senderUid,
          text
        })
      }
    })

    // when disconnect
    socket.on('disconnect', () => {
      sessions.removeSession(socket.id)
    })
  })
  io.listen(process.env.SOCKET_PORT)

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    if (req.app.get('env') !== 'development') {
      if (err.status === 500) err.message = 'An unexpected condition was encountered.'
      if (err.status === 400) err.message = 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'

      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
    }

    // Development only!
    // Only providing detailed error in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        cause: err.cause
          ? {
              status: err.cause.status,
              message: err.cause.message,
              stack: err.cause.stack
            }
          : null,
        stack: err.stack
      })
  })

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log(`Websocket-Server running at http://localhost:${process.env.SOCKET_PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
