<script lang="ts">
  import Header from "./Header.svelte";
  import Home from "./Home.svelte";
  import Future from "./Future.svelte";
  import NotFound from "./NotFound.svelte";
  let page = "Home"; // default page
  const handlePage = (event: CustomEvent<string>) => {
    page = event.detail;
  }
  $: console.log(page);
</script>
<Header on:page={handlePage} {page} />
{#if page === "Home"}
<Home />
{:else if page === "My Future"}
<Future />
{:else}
<NotFound />
{/if}
