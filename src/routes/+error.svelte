<script lang="ts">
  import { page } from "$app/state";
  import error from "$lib/assets/error.jpg"
</script>

<h1>{page.status}: {page.error?.message}</h1>
<h2>Coś poszło nie tak</h2>
<img src={error} alt=":3">