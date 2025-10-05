<script lang="ts">
  import DummyThickData from "$lib/ts/dummyThickData/dummyThickData";
</script>

<svelte:head>
  <title>{DummyThickData.title}</title>
</svelte:head>

<header class="flex"><h1>This is a very professional header</h1></header>
<section class="gallery flex">Imagine a rotating gallery here</section>
<section class="catchphrase flex">
  <h2>Welcome to RacistMaster9000</h2>
</section>
<nav class="navigation flex">
  <p><a href="/Login">Wanna log in?</a></p>
  <p><a href="/Register">Wanna register?</a></p>
  <p><a href="/Dashboard">Wanna casually view results?</a></p>
</nav>

<footer class="flex">{DummyThickData.copyright}</footer>

<style>
  header {
    width: 100%;
    height: 4rem;
    font-size: 2rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .gallery {
    width: 100%;
    height: 20rem;
  }
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  nav {
    height: 18rem;
    width: 100%;
  }
  footer {
    width: 100%;
  }
</style>

