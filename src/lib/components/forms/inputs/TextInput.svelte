<script lang="ts">
    import { getFormObject } from "../Form.svelte";

    interface Params {
        label: string,
        key: string
    };

    const { label, key }: Params = $props();

    const object = getFormObject(key, 'string');
</script>

<label>{label}
    <input type="text" name={key} bind:value={object[key]} required/>
</label>