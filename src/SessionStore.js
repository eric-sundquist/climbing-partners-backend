/**
 * Module for the sessionStore which handles users connected to the websocket server.
 *
 * @author Eric Sundqvist
 * @version 1.0.0
 */

/**
 * Session store type handles users connected to websocketserver
 */
export class SessionStore {
  /**
   * Creates an instance of the current type.
   */
  constructor () {
    this.users = []
  }

  /**
   * Finds a user sesssion.
   *
   * @param {string} uid - User Id to find.
   * @returns {object} found session.
   */
  findSession (uid) {
    return this.users.find((user) => user.uid === uid)
  }

  /**
   * Saves a new user session.
   *
   * @param {string} uid - User Id to find.
   * @param {string} socketId - Socket Id to add.
   */
  saveSession (uid, socketId) {
    // If user already in session remove old session and replace with new.
    const userAlreadyInSession = this.users.find((user) => user.uid === uid)
    if (userAlreadyInSession) {
      this.users.splice(this.users.indexOf(userAlreadyInSession), 1)
    }
    this.users.push({ uid, socketId })
  }

  /**
   * Removes a user session.
   *
   * @param {string} socketId - Socket Id to remove.
   */
  removeSession = (socketId) => {
    this.users = this.users.filter((user) => user.socketId !== socketId)
  }
}
