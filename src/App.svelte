<script>
  export let name;
  import Board from "./Board.svelte";
  const players = [
    { name: "alice" },
    { name: "bob" },
    { name: "charlie" },
    { name: "dot" },
    { name: "ev" }
  ];
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello {name}!</h1>

<Board {players} />
