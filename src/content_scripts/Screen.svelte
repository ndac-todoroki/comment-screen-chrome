<script lang="ts">
  import Comment from "./Comment.svelte";
  import { v4 as uuid } from "uuid";

  class CommentData {
    /* binds */
    // readonly width: number; // 何故か1/4になるバグ？があるので一旦利用しない
    // readonly size: number;
    readonly getOffsetLeft: () => number;
    readonly getWidth: () => number;

    /* props */
    readonly id: string;
    readonly position: number;
    readonly top: number;

    constructor(readonly text: string) {
      this.id = uuid();
      this.position = calcCorrectPosition();
      this.top = this.position * 10;
    }
  }

  let newComment: string | null = null;

  let comments: Array<CommentData> = [];
  let screenWidth: number;
  let getNewCommentWidth: () => number;
  let animationDuration: number = 5; // seconds

  export function addComment(comment: string): boolean {
    comment = comment.trimEnd();
    if (comment === "") return false;

    // Set new comment to hidden DOM to calculate actual width
    newComment = comment;

    comments = [...comments, new CommentData(newComment)];
    newComment = null;
    return false;
  }

  function removeComment(id: string) {
    comments = comments.filter((t) => t.id !== id);
  }

  export function removeAllComments(): void {
    comments = [];
  }

  function calcCorrectPosition(): number {
    if (comments.length == 0) return 0;

    const availablePositions = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const remaining: Set<number> = comments
      .map(({ position, getOffsetLeft, getWidth }) => {
        const offsetLeft = getOffsetLeft();
        const width = getWidth();
        const fromRightPercents =
          100 - percentageRounded((offsetLeft + width) / screenWidth);
        const wontOverlap = willNotOverlap(width, offsetLeft);
        const insertable: boolean = fromRightPercents < 1 ? false : wontOverlap;

        // console.log({offsetLeft, width, screenWidth, fromRightPercents, wontOverlap, insertable})
        return { position, insertable };
      })
      .reduce((remaining, { position, insertable }) => {
        if (!insertable) {
          remaining.delete(position);
        }
        return remaining;
      }, availablePositions);

    const position: number = remaining.size == 0 ? 0 : Math.min(...remaining);

    return position;
  }

  /**
   * 進行速度の比からコメントを同じ行に置いてよいか判断する
   */
  function willNotOverlap(width: number, offsetLeft: number): boolean {
    const fromRight: number = screenWidth - (width + offsetLeft);
    const newCommentWidth = getNewCommentWidth();
    if (fromRight < 0) return false;

    // const oldWordArrivalTime = animationDuration * (screenWidth - fromRight) / (screenWidth + width)
    // const newWordArrivalTime = animationDuration * screenWidth / (screenWidth + newCommentWidth)
    const discriminant =
      (screenWidth - fromRight) / (screenWidth + width) -
      screenWidth / (screenWidth + newCommentWidth);

    return discriminant <= 0;
  }

  /**
   * 小数第一位までの100分率を計算する
   */
  const percentageRounded = (value: number) => Math.round(value * 1000) / 10;
</script>

<style>
  .screen {
    /* background: #eeeeee; */
    /* background: rgba(128, 128, 128, 0.3); */
    /* width: 1280px; */
    /* height: 720px; */
    /* margin-left: 100px; */
    /* display: inline-flex; */
    /* flex-direction: column; */
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    pointer-events: none;
  }
</style>

<div class="screen" bind:clientWidth={screenWidth}>
  <Comment
    bind:getWidth={getNewCommentWidth}
    text={""}
    topPercentage={0}
    duration={0}
    style="opacity: 0; position: absolute;" />
  {#each comments as { id, text, top, getOffsetLeft, getWidth } (id)}
    <Comment
      {text}
      bind:getOffsetLeft
      bind:getWidth
      topPercentage={top}
      color={'white'}
      duration={animationDuration}
      on:animationEnd={() => removeComment(id)} />
  {/each}
</div>
