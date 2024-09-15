<script lang="ts">
  import Typer from "./Typer.svelte";
  import Footer from "./Footer.svelte";
</script>

<main>
  <section>
    <div class="segment">
      <div>
        <p class="text-indent"><Typer delayMultiplier={.4} cursorStay={false}>Hi, my name is Ares Stavropoulos! I'm 20 years old attending <img alt="University of Illinois at Chicago" class="uic-logo" src="../public/logos/uic.png">, where I major in Computer Science.</Typer></p>
        <p><Typer delayMultiplier={.4}>For the last few years I've co-founded Routedashbard Inc., a pest control software where we service a multitude of large scale businesses to improve their management of services and clients. It was through this process I learned project planning, AWS, database architecting, and so much more.</Typer></p>
        <p class="high-top">
          <Typer delayMultiplier={.4}>One of the primary reasons I'm drawn to computer science is my fascination with the intricate inner workings of technology. I thrive on exploring the underlying mechanisms that power our digital world, from the low-level optimizations in system architecture to the clever algorithms driving high-performance software.</Typer>
        </p>
        <div class="indent">
          My curiosity often leads me to investigate questions that delve into the core of how things function: How do modern compilers achieve impressive code optimizations? What innovative data structures enable lightning-fast database queries? How are cloud infrastructures designed to provide seamless, low-latency connections between services?
        </div>
        <p class="low-top">
          I believe that the fight to understand as many of these answers as I can is what makes computer science so intruging.
        </p>

      </div>
    </div>
    <img class="profile" alt="profile" src="../public/ares-arcade.jpg">
  </section>
</main>
<Footer />

<style>
.high-top {
  margin-top: 25px;
}
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
