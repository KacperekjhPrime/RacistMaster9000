<script lang="ts">
  import Button from "$lib/components/atoms/Button.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<h1>
  If you got here it's probably by accident. I test here components in isolation
  please go back to <a href="/">home page</a>
</h1>

<Button
  type="primary"
  onclick={() => {
    console.log("uwu");
  }}>uwu</Button
>
