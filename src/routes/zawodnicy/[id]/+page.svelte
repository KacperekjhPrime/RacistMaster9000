<script lang="ts">
    import RiderForm from "$lib/components/forms/RiderForm.svelte";

    const { data } = $props();

    const rider = {
        name: data.rider.name,
        surname: data.rider.surname,
        schoolId: `${data.rider.schoolId}`
    }
</script>

<RiderForm id={data.rider.riderId} {rider} schools={data.schools} />