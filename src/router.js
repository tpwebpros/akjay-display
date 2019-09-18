import { currentRoute } from "./stores"
import NotFound from "./NotFound.svelte"

export default class Router {
  constructor(routes) {
    this.routes = routes
  }

  default() {
    let root = "/"
    let path = this.routes[root] ? root : Object.keys(this.routes)[0]

    return {
      path,
      component: this.routes[path],
      data: {}
    }
  }

  pathWithOnePlaceholder(pathPrefix) {
    return new RegExp(`^${pathPrefix}\/([\\w-]+)\/?$`)
  }

  match(route) {
    const exact = Object.keys(this.routes).find(knownRoute => {
      if (route === knownRoute) {
        return true
      }
    })

    if (exact) {
      return {
        path: route,
        component: this.routes[exact],
        data: {}
      }
    }

    const [path, queryString] = route.split("?")

    let match = path.match(this.pathWithOnePlaceholder("/games"))
    if (match) {
      let gameId = match[1]
      return {
        path,
        component: this.routes["/games/:gameId"],
        data: { gameId }
      }
    }

    match = path.match(this.pathWithOnePlaceholder("/join"))
    if (match) {
      let gameInstanceId = match[1]
      let params = paramsObject(queryString)
      return {
        path,
        component: this.routes["/join/:gameInstanceId"],
        data: { ...params, gameInstanceId }
      }
    }

    match = path.match(this.pathWithOnePlaceholder("/play"))
    if (match) {
      let teamId = match[1]
      let params = paramsObject(queryString)
      return {
        path,
        component: this.routes["/play/:teamId"],
        data: { ...params, teamId }
      }
    }

    match = path.match(this.pathWithOnePlaceholder("/board"))
    if (match) {
      const gameInstanceId = match[1]
      return {
        path,
        component: this.routes["/board/:gameInstanceId"],
        data: { gameInstanceId }
      }
    }

    return {
      path,
      component: NotFound,
      data: {}
    }
  }
}

function paramsObject(queryString) {
  let searchParams = new URLSearchParams(queryString)
  let params = {}

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}

export function redirect(path, params = {}) {
  let pathWithParams = pathWithQueryString(path, params)
  currentRoute.set(pathWithParams)

  window.history.pushState(
    {
      path: pathWithParams
    },
    "",
    window.location.origin + pathWithParams
  )
}

export function pathWithQueryString(path, params) {
  let query = queryString(params)
  return query.length > 0 ? `${path}?${query}` : path
}

export function queryString(params) {
  if (typeof params === "string") {
    return new URLSearchParams(params).toString()
  }

  let searchParams = new URLSearchParams()

  for (const key in params) {
    if (params[key] !== undefined) {
      searchParams.append(key, params[key])
    }
  }

  return searchParams.toString()
}
