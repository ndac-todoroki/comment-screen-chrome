<script lang="ts">
  export let state: boolean;
  export let onLabel: string;
  export let offLabel: string;
</script>

<style>

</style>

<div class="pretty p-switch p-fill">
  <input type="checkbox" bind:checked={state} on:change />
  <div class="state">
    {#if state}
      <label>{onLabel}</label>
    {:else}
      <label>{offLabel}</label>
    {/if}
  </div>
</div>
