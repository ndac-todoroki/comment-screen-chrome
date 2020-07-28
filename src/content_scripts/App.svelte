<script lang="ts">
  import { browser } from "webextension-polyfill-ts";
  import Screen from "./Screen.svelte";

  let addCommentToScreen: (s: string) => boolean;

  let visibleState: boolean;
  let display: string;
  $: display = visibleState ? "" : "display: none;";
  let removeAllComments: () => void;

  browser.storage.local.get("visibility").then(
    settings => (visibleState = settings.visibility.visible),
    () => (visibleState = false)
  );

  const logStorageChangeListener = (changes: object, area: string) => {
    // console.log("Change in storage area: " + area);

    let changedItems = Object.keys(changes);

    for (let item of changedItems) {
      /* For Debugging */
      // console.log(item + " has changed:");
      // console.log("Old value: ");
      // console.log(changes[item].oldValue);
      // console.log("New value: ");
      // console.log(changes[item].newValue);

      itemCheck: {
        if (item === "visibility" && "visible" in changes[item].newValue) {
          // console.info("visibility");
          const oldVisibleState = visibleState;
          visibleState = !!changes[item].newValue["visible"];
          if (oldVisibleState === true && visibleState === false) { removeAllComments(); }
          break itemCheck;
        }
        if (item === "newComment" && "text" in changes[item].newValue) {
          const comment: string = changes[item].newValue["text"];
          console.info("incoming: " + comment);
          addComment(comment);
          break itemCheck;
        }
      }
    }
  };

  const addComment = (comment: string): boolean => {
    // コメントDIVを表示しない間は新規コメントを破棄する
    if (!visibleState) return false;

    if (comment == null) return false;
    comment = comment.trimEnd();
    if (comment === "") return false;

    return addCommentToScreen(comment);
  };

  const showScreen = () => (display = "");
  const hideScreen = () => (display = "display: none;");

  const css = browser.extension.getURL("/css/bundle.css");

  browser.storage.onChanged.addListener(logStorageChangeListener);
</script>

<style>
  .screen {
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href={css} />
</svelte:head>
<div class="screen" style={display}>
  <Screen bind:addComment={addCommentToScreen} bind:removeAllComments />
</div>
