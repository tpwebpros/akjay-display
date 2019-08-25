<script>
  import { currentRoute } from "./stores.js";

  export let page = { path: "/", title: "Home" };

  function redirect(event) {
    currentRoute.set(event.target.pathname);

    window.history.pushState(
      { path: page.path },
      "",
      window.location.origin + page.path
    );
  }
</script>

<style>

</style>

<a href={page.path} on:click|preventDefault={redirect}>{page.title}</a>
