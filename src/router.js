// import Home from './Home.svelte';
// import About from './About.svelte';
import GamePicker from "./GamePicker.svelte";
import GameInstancePicker from "./GameInstancePicker.svelte";

const routes = {
  "/": GamePicker,
  "/games": GamePicker,
  "/game/:gameId": GameInstancePicker
}

function match(route) {
  const exact = Object.keys(routes).find(knownRoute => {
    console.log({
      route,
      knownRoute
    })
    if (route === knownRoute) {
      return true
    }
  });

  if (exact) {
    return {
      path: route,
      component: routes[exact],
      data: {}
    }
  }

  const match = route.match(/^\/games\/([\w-]+)$/)
  if (match) {
    return {
      path: route,
      component: routes["/game/:gameId"],
      data: match[1]
    }
  }
}

export const router = {
  home: () => {
    return {
      path: "/",
      component: GamePicker
    }
  },
  games: () => {
    return {
      path: "/games",
      component: GamePicker
    }
  },
  game: (id) => {
    return {
      path: `/games/${gameid}`,
      component: GameInstancePicker
    }
  },

  match,
}

export default router;
