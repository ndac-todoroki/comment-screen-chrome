<script lang="ts">
  /**
   * 規定の秒数の間親要素を流れるコメント
   * 流れ終わったコメントは親要素の責任で処理する。
   * CSSアニメーションを利用していて、アニメーションが終わると `on:animationEnd` カスタムイベントを発火させる
   */

  import { animationend } from "./animationend";

  export let text: string;
  export let topPercentage: number;
  export let opacity: number = 0.8;
  export let color: string = "white";
  export let style: string = "";
  export let duration: number;

  let comment: HTMLElement;

  let divHeight: number;
  export let fontSize: number = undefined;
  $: fontSize = Math.round(divHeight * 9) / 10;

  export const getOffsetLeft = () => {
    return comment.offsetLeft;
  };

  export const getWidth = () => {
    return comment.clientWidth;
  }
</script>

<style>
  div {
    text-align: start;
    height: 10%;
    width: auto;
  }

  span {
    white-space: pre;
    margin: 0;
  }

  .comment-box {
    position: absolute;
    width: 100%;
  }

  .comment {
    position: inherit; /* 何故か必要 */
    display: inline-block;
    animation: linear alternate;
    animation-name: run;
    /* -webkit-text-stroke-color: darkslategray; */
    /* -webkit-text-stroke-width: 1px; */
    text-shadow: 0px 0px 3px darkslategray;
    font-weight: 600;
    font-family: "ＭＳ Ｐゴシック", "MS PGothic", "メイリオ", "Meiryo",
      "ヒラギノ角ゴシック", "Hiragino Sans";
  }

  .white.opacityHard {
    color: rgba(236, 236, 236, 0.5);
  }

  .white {
    color: rgb(236, 236, 236);
  }

  .black {
    color: darkslategray;
  }

  @keyframes run {
    0% {
      left: calc(100% + 5px);
      transform: translateX(0%);
    }
    100% {
      left: calc(0% - 5px);
      transform: translateX(-100%);
    }
  }
</style>

<svelte:options immutable accessors />
<!-- 規定の秒数の間親要素を流れるコメント
  流れ終わったコメントは親要素の責任で処理する。
  CSSアニメーションを利用していて、アニメーションが終わると `on:animationEnd` カスタムイベントを発火させる -->
<div
  class="comment-box"
  bind:clientHeight={divHeight}
  style="top: {topPercentage}%;">
  <span
    class="comment {color}"
    bind:this={comment}
    use:animationend
    on:animationEnd
    style="font-size: {fontSize}px; opacity: {opacity}; animation-duration: {duration}s;
    {style}">
    {text}
  </span>
</div>
