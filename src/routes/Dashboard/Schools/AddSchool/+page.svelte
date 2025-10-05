<script lang="ts">
  import type { PageProps } from "./$types";
  import SchoolForm from "$lib/components/forms/SchoolForm.svelte";
  import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";

  let { data }: PageProps = $props();
</script>


<SchoolForm addSchool={OmniAPI.addSchool}></SchoolForm>
