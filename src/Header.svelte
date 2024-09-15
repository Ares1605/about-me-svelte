<script lang="ts">
import { createEventDispatcher } from "svelte";
import TextParser from "./TextParser.svelte";
import Typer from "./Typer.svelte";
export let page: string;

const dispatch = createEventDispatcher();

const changePage = (newPage: string) => {
  page = newPage;
  dispatch('page', page);
}
</script>
<header>
  <h1>
    <Typer cursorStay={true} delayMultiplier={2}>
      <TextParser text={`About Me - ${page}()`}/>
    </Typer>
  </h1>
  <nav>
    <TextParser text="const links = ["/>
    <button on:click={() => changePage("Home")}><TextParser text={'"Home",'} /></button>
    <button on:click={() => changePage("Goals")}><TextParser text={'"Goals",'} /></button>
    <button on:click={() => changePage("My.Future")}><TextParser text={'"My Future",'} /></button>
    <button on:click={() => changePage("MyPast")}><TextParser text={'"My Past"'} /></button>
    <TextParser text="]"/>
  </nav>
</header>
<style>
h1 {
  /* force height even when the letters are not typed yet */
  min-height: 1em;
  margin-left: calc(50% - 180px);
  line-height: 1;
}
header {
  width: 100%;
  margin-bottom: 25px;
}
nav {
  margin: auto;
  max-width: 600px;
  display: flex;
  justify-content: space-around;
}
button {
  cursor: pointer;
  background-color: unset;
  border: none;
  padding: 0;
  font-family: 'JetBrains Mono';
}
button:hover {
  text-decoration: underline;
}
</style>
