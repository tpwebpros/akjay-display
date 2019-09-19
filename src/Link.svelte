<script>
  import { redirect, pathWithQueryString } from "./router";
  export let page = { params: {}, path: "/", title: "Home" };
  export let target = null;

  function handleClick(event) {
    redirect(event.target.pathname, event.target.search);
  }

  function href({ path, params }) {
    return pathWithQueryString(path, params);
  }
</script>

<style>

</style>

<a
  href={href(page)}
  on:click|preventDefault={handleClick}
  target={target || ''}>
  {page.title}
</a>
