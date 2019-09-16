import { clearFlash } from "./stores"

export default class Client {
  constructor(server) {
    this.server = server
  }

  url(path, params) {
    const url = new URL(this.server.url)
    url.pathname = url.pathname + path
    url.searchParams.set("code", this.server.accessCode)

    Object.entries(params).forEach(({ key, value }) => {
      url.searchParams.set(key, value)
    })

    return url
  }

  async get(path, options = {}) {
    clearFlash()
    const url = this.url(path, options.params || {})

    try {
      const response = await fetch(url, {
        mode: "cors"
      })

      if (response.status !== 200) {
        console.error(`get ${url} status=${response.status}`)
        return {}
      }

      const json = await response.json()

      return json
    } catch (err) {
      console.error(err)
    }
  }

  async post(path, options = {}) {
    clearFlash()
    const url = this.url(path, {})

    try {
      const response = await fetch(url, {
        body: JSON.stringify(options.params || {}),
        method: "POST",
        mode: "cors"
      })

      if (response.status > 299) {
        var message = "An error occurred"

        try {
          const json = await response.json()
          message = json.message
        } catch (err) {
          console.error(err)
        }

        return Promise.reject(new Error(message))
      }

      return await response.json()
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }

  async getTeams() {
    return this.get("/teams")
  }

  async getGames() {
    return this.get("/games")
  }

  async getGameInstances(gameId) {
    return this.get(`/gameinstances`, {
      params: {
        gameId
      }
    })
  }

  async getGameInstance(gameInstanceId) {
    return this.get(`/gameinstances/${gameInstanceId}`)
  }

  async createTeam({ name, avatar, gameInstanceId }) {
    return this.post(`/teams`, {
      params: {
        name,
        instanceId: gameInstanceId
      }
    })
  }
}
