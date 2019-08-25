import {
  writable
} from "svelte/store";

export default class Client {
  constructor(server) {
    this.server = server
  }

  async get(path, options = {}) {
    const url = new URL(this.server.url);
    url.pathname = url.pathname + path;
    url.searchParams.set("code", this.server.accessCode);

    Object.entries(options.params || []).forEach(({
      key,
      value
    }) => {
      url.searchParams.set(key, value);
    });

    try {
      const response = await fetch(url, {
        mode: "cors"
      });

      if (response.status !== 200) {
        console.error(`get ${url} status=${response.status}`)
        return {}
      }

      console.log({
        url,
        response
      });
      const json = await response.json();

      return json
    } catch (err) {
      console.error(err);
    }
  }

  async getTeams() {
    return this.get("/teams");
  }

  async getGames() {
    return this.get("/games");
  }

  async getGameInstances(gameId) {
    return this.get(`/gameinstances`, {
      params: {
        gameId
      }
    });
  }
}
