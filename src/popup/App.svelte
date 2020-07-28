<script lang="ts">
  import Toggle from "./src/Toggle.svelte";

  import { browser } from "webextension-polyfill-ts";

  let visibleState: boolean;

  browser.storage.local.get("visibility").then(
    settings => (visibleState = settings.visibility.visible),
    () => (visibleState = false)
  );

  const onVisibleToggle = () => {
    browser.storage.local.set({
      visibility: { visible: visibleState }
    });
  };
</script>

<style>
  div {
    width: 10rem;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="/css/pretty-checkbox.min.css" />
  <link rel="stylesheet" href="/css/bundle.css" />
</svelte:head>
<div>
  <Toggle
    bind:state={visibleState}
    onLabel={'コメント表示中'}
    offLabel={'コメント非表示中'}
    on:change={onVisibleToggle} />
</div>
