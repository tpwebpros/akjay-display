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

    try {
      const response = await fetch(url, {
        mode: "cors"
      });
      const json = await response.json();
      console.log(json);
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
    return this.get(`/games/${gameId}/instances`);
  }
}
