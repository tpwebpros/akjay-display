import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    server: {
      url: "https://tpwptrivia.azurewebsites.net/api",
      accessCode: "sS4WX0N9YeVBUsRGTwC9TgD6QzSAOYraSzSE7YRbBDBpV0vVZjaegQ=="
    },
  }
});

export default app;
