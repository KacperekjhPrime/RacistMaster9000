<script lang="ts">
    import GokartForm from "$lib/components/forms/GokartForm.svelte";
    import { removeKeys } from "$lib/ts/helper";

    let { data } = $props();
</script>

<GokartForm id={data.gokart.gokartId} gokart={removeKeys(data.gokart, ['gokartId'])}/>