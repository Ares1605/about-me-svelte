<script lang="ts">
  export let hidden: boolean;
  export let full: boolean;
  export let blink: boolean = false;

  let blinkingInterval: number|null = null;
  const doBlink = () => {
    hidden = !hidden;
  }
  $: if (blink) {
    if (blinkingInterval === null) {
      blinkingInterval = setInterval(doBlink, 450);
    }
  } else {
    if (blinkingInterval !== null) {
      clearInterval(blinkingInterval);
      blinkingInterval = null;
    }
  }
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (blinkingInterval !== null)
      clearInterval(blinkingInterval);
  });
</script>
<div class:hidden={hidden} class:full={full}></div>
<style>
  div {
    width: 16px;
    background-color: #8F8A51;
    height: 10px;
  }
  .hidden {
    opacity: 0;
  }
  .full {
    height: 1em;
  }
</style>
