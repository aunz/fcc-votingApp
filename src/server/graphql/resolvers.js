import { randomBytes } from 'crypto'
import {
  createIpUser, createAuthUser, getAndUpdateUserFromToken, updateUser, deleteToken,
  getPoll, getPolls, votedPolls,
  createPoll, votePoll, addPollOption,
} from '~/server/db/dbFunctions'
import { errInput, errAuth } from '~/server/errors'

import { authWithGitHub } from '~/server/OAuth'

const { GH_CLIENT_ID } = process.env

export default {
  Query: {
    getPolls(_, args) {
      // return new Promise(res => setTimeout(res, 2500, getPolls(args)))
      return getPolls(args)
    },
    getPoll(_, args) {
      return getPoll(args)
    },
    votedPolls(_, { token }, { req }) {
      const user = getAndUpdateUserFromToken(token)
      const id = user && user.id || createIpUser(req.ip)
      return votedPolls(id)
    },
    getClientId() {
      return GH_CLIENT_ID
    }
  },
  Mutation: {
    createPoll(_, { q, o, token }) {
      q = q.trim()
      if (q.length < 3) throw errInput()

      const newObj = {}
      for (const e of o) {
        const tmp = e.trim()
        if (tmp) newObj[tmp] = true
      }
      o = Object.keys(newObj)
      if (o.length < 2) throw errInput()

      const user = getAndUpdateUserFromToken(token)
      if (!user) throw errAuth()

      try {
        return createPoll({
          uid: user.id,
          q,
          o
        })
      } catch (e) {
        if (/^UNIQUE constraint/.test(e.message)) return 0
        throw e
      }
    },
    async loginWith(_, { provider, code }) {
      if (!provider || !code) throw errInput()

      // need to protect these from spam
      if (provider === 'GH') {
        const { id, name } = await authWithGitHub(code)
        const uid = createAuthUser('gh', id, { gh_name: name })
        const token = (await randomBytes(21)).toString('base64') // a random token to be sent to client
        const user = { id: uid, token, gh_name: name }
        updateUser(user)
        return user
      }
      if (provider === 'TOKEN') {
        const user = getAndUpdateUserFromToken(code)
        if (!user) return null
        user.token = code
        return user
      }

      throw errInput()
    },
    async logout(_, { token }) {
      if (!token) return undefined
      return deleteToken(token)
    },
    votePoll(_, { id, key, token }, { req }) {
      console.log('the ip', req.ip, req.ips)
      const user = getAndUpdateUserFromToken(token)
      return votePoll({
        uid: user && user.id || createIpUser(req.ip),
        pid: id,
        key
      })
    },
    addKey(_, { id, key, token }) {
      if (!key.length) return 0
      const user = getAndUpdateUserFromToken(token)
      if (!user) return 0
      return addPollOption({
        uid: user.id,
        pid: id,
        o: key
      })
    },
  },
}
