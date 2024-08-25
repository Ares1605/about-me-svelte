<script lang="ts">
  import Typer from "./Typer.svelte";
  import Footer from "./Footer.svelte";
</script>

<main>
  <section>
    <div class="segment">
      <div>
        <p class="text-indent">Hi, my name is Ares Stavropoulos! I'm 20 years old attending <a target="_blank" href="https://www.uic.edu/"><img alt="University of Illinois at Chicago" class="uic-logo" src="../public/logos/uic.png"></a>, where I major in Computer Science.</p>
        <p class="low-bottom">
          <Typer delayMultiplier={.4}>One of the reasons I love computer science is my interest in diving as far into the nitty gritty of technologies.</Typer>
        </p>
        <div class="indent">
          How exactly code bundlers split code optimally? What strategies does Redis use for their sub-millisecond read latency? How does AWS group servers in the real-world, that I can connect to an RDS server from my EC2 within 3 milliseconds?
        </div>
        <p class="low-top">
          I believe that the fight to understand as many of these answers as I can is what makes computer science so intruging.
        </p>

      </div>
    </div>
    <img class="profile" alt="profile" src="../public/ares-movies.jpg">
  </section>
</main>
<Footer />

<style>
.uic-logo {
  height: 1em;
  width: auto;
  vertical-align: bottom;
}
.profile {
  flex: 3;
  min-width: 0px;
  height: auto;
  border-radius: 2px;
}
p {
  margin: 5px;
  word-wrap: break-word;
}
</style>
