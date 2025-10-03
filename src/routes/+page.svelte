<script lang="ts">
  import Icon from "$lib/components/atoms/Icon.svelte";
  import DummyThickData from "$lib/ts/dummyThickData/dummyThickData";
</script>

<svelte:head>
  <title>{DummyThickData.title}</title>
</svelte:head>

<h1>Welcome to RacistMaster9000</h1>
<p>
  Visit <a href="/Dashboard">this</a> for us to race your mom
</p>

<footer>{DummyThickData.copyright}</footer>

<Icon icon="refresh" css="" fill="black" size="4rem"></Icon>
