<script lang="ts">
    import SchoolForm from "$lib/components/forms/SchoolForm.svelte";
    import { removeKeys } from "$lib/ts/helper.js";

    const { data } = $props();
</script>

<SchoolForm id={data.school.schoolId} school={removeKeys(data.school, ['schoolId'])} />