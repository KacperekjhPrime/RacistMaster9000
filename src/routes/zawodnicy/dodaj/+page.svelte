<script lang="ts">
    import RiderForm from "$lib/components/forms/RiderForm.svelte";

    const { data } = $props();
</script>

<RiderForm schools={data.schools} />