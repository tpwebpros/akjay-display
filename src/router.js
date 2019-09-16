import { currentRoute } from "./stores"

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

    let match = route.match(/^\/games\/([\w-]+)$/)
    if (match) {
      return {
        path: route,
        component: this.routes["/game/:gameId"],
        data: match[1]
      }
    }

    match = route.match(/^\/join\/([\w-]+)$/)
    if (match) {
      return {
        path: route,
        component: this.routes["/join/:gameInstanceId"],
        data: match[1]
      }
    }

    match = route.match(/^\/play\/([\w-]+)$/)
    if (match) {
      return {
        path: route,
        component: this.routes["/play/:teamId"],
        data: match[1]
      }
    }
  }
}

export function redirect(path, params = {}) {
  let searchParams = new URLSearchParams(params)
  let pathWithParams = searchParams.keys.length > 0 ? `${path}?${searchParams.toString()}` : path

  currentRoute.set(pathWithParams)

  window.history.pushState(
    {
      path: pathWithParams
    },
    "",
    window.location.origin + pathWithParams
  )
}
