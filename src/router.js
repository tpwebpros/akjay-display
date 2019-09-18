import { currentRoute } from "./stores"
import NotFound from "./NotFound.svelte"

export default class Router {
  constructor(routes) {
    this.routes = this.compileRoutes(routes)
  }

  compileRoutes(routes) {
    let compiled = {}
    Object.entries(routes).forEach(([path, component]) => {
      compiled[path] = { component, ...this.matcherFor(path) }
    })
    return compiled
  }

  matcherFor(path) {
    const names = path
      .split(":")
      .slice(1)
      .filter(x => x)
      .map(part => {
        const [name] = part.split("/")
        return name
      })

    const matcher = "([\\w-]+)"
    let template = path

    for (name of names) {
      template = template.replace(`:${name}`, matcher)
    }

    return { names, regexp: new RegExp(`^${template}/?$`) }
  }

  match(route) {
    const [path, queryString] = route.split("?")

    let match = null
    const matchedRoute = Object.values(this.routes).find(route => {
      match = path.match(route.regexp)
      return match != null
    })

    if (match) {
      const { component, names } = matchedRoute
      let namedParams = {}

      names.forEach((name, i) => {
        namedParams[name] = match[i + 1]
      })

      let params = paramsObject(queryString)
      return { path, component, data: { ...namedParams, ...params } }
    }

    return { path, component: NotFound, data: {} }
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
