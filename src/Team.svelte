<script>
  import Avatar from "./Avatar.svelte";
  import Score from "./Score.svelte";
  export let avatar;
  export let name;
  export let score = null;
  const avatarSize = "2rem";
</script>

<style>
  .team {
    margin: 1em 0;
    display: flex;
    flex-flow: row nowrap;
  }

  .name {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0.4rem 0 0 0.4rem;
  }
</style>

<div class="team">
  {#if name}
    <Avatar {avatar} size={avatarSize} />
    <span class="name">{name}</span>
    {#if score != null}
      <Score {score} />
    {/if}
  {/if}
</div>
