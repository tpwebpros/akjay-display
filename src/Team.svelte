<script>
  export let avatar;
  export let name;
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

  .team .avatar {
    font-style: normal;
    font-size: 2rem;
  }
</style>

<div class="team">

  {#if avatar}
    {#if avatar === 'none' && name}
      <span class="avatar ec ec-question" />
    {/if}
    <span class="avatar ec ec-{avatar}" />
  {/if}

  {#if name}
    <span class="name">{name}</span>
  {/if}
</div>
