<script lang="ts">
import Cursor from "./Cursor.svelte";
import { Type, type cursorType } from "./Type";
import { onMount } from "svelte";
export let delayMultiplier: number = 1;
export let justify: string = "left";
export let cursorStay = false;
export let cursorHidden = false;
export let cursorFull = false;
export let cursorBlink = false;

const cursor: cursorType = {
  hidden: cursorHidden,
  blink: cursorBlink,
  stay: cursorStay,
  full: cursorFull
};

let hiddenContainer: HTMLDivElement;
let invisibleContainer: HTMLDivElement;
let container: HTMLDivElement;
let cursorEle: HTMLDivElement;

onMount(() => {
  const typer = new Type(hiddenContainer, invisibleContainer, container, delayMultiplier, cursorEle, cursor);
  typer.run();

  const observer = new MutationObserver(() => typer.run());
  observer.observe(hiddenContainer, { childList: true, subtree: true });
});

</script>

<div class="parent" style="justify-content: {justify}">
  <div class="inner">
    <div class="hidden-container">
      <div bind:this={hiddenContainer} class="text"><slot /></div>
    </div>
    <div class="invisible-container">
      <div bind:this={invisibleContainer} class="text"></div>
      {#if cursorStay}
        <Cursor hidden={cursorHidden} full={false} />
      {/if}
    </div>
    <div class="container" style="justify-content: {justify}">
      <div bind:this={container} class="text"><div class="cursor" bind:this={cursorEle}><Cursor hidden={cursor.hidden} full={cursor.full} blink={cursor.blink} /></div></div>
    </div>
  </div>
</div>

<style>
.text {
  display: inline-block;
  white-space: pre-wrap;
}
.container {
  position: absolute;
  top: 0;
  left: 0;
}
.parent {
  display: flex;
  position: relative;
}
.hidden-container {
  display: none;
}
.invisible-container {
  opacity: 0;
}
.inner {
  position: relative;
}
.invisible-container, .container {
  display: flex;
  align-items: end;
}
.cursor {
  display: inline-block;
  vertical-align: bottom; /* throw the cursor to inline of the text */

  /*
    this part is important.
    this ensures the cursor doesn't take up space,
    so a text-align: center, isn't offcentered when
    the cursor persists, or deletes
  */
  width: 0px;
  overflow: visible;
}
</style>
