<script>
  import { redirect } from "./router";
  export let page = { path: "/", title: "Home" };

  function handleClick(event) {
    redirect(event.target.pathname);
  }
</script>

<style>

</style>

<a href={page.path} on:click|preventDefault={handleClick}>{page.title}</a>
