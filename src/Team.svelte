<script>
  import Avatar from "./Avatar.svelte";
  export let avatar;
  export let name;
  const avatarSize = "2rem";
</script>

<style>
  .team {
    margin: 1em 0;
    font-size: 1.2rem;
    font-weight: 700;
  }

  .team .name {
    position: relative;
    display: inline-block;
    top: -0.2rem;
  }
</style>

<div class="team">
  {#if name}
    <Avatar {avatar} size={avatarSize} />
    <span class="name">{name}</span>
  {/if}
</div>
