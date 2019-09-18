<script>
  import Avatar from "./Avatar.svelte";
  export let avatar;
  export let name;
  export let score;
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
    margin-top: 0.4rem;
  }

  .score {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin: 0.2em 1em 0.4em;
  }

  .score :first-child {
    background-color: #444;
    border-radius: 1.4em;
    color: #eee;
    display: inline-block;
    font-size: 1rem;
    font-weight: 700;
    height: 1.4em;
    width: 1.4em;
    padding: 0.3em;
    position: relative;
    text-align: center;
  }

  .score :nth-child(2) {
    font-size: 0.8rem;
  }
</style>

<div class="team">
  {#if name}
    <Avatar {avatar} size={avatarSize} />
    <span class="name">{name}</span>
    {#if score != null}
      <span class="score">
        <span>{score}</span>
        <span>score</span>
      </span>
    {/if}
  {/if}
</div>
