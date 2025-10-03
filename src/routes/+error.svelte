<script lang="ts">
  import { page } from "$app/state";
</script>

<h1>{page.status}: {page.error?.message}</h1>
<h2>We apologize for fucking it up</h2>
