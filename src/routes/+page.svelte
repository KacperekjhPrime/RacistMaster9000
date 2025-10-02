<script>
    import { onMount } from "svelte";

    onMount(async () => {
        const response = await fetch("/api/controllerEvents");
        const result = await response.json();
        
        console.log(result);
    });
</script>