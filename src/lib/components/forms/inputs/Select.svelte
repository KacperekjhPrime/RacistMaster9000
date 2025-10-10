<script lang="ts">
    import { getFormObject } from "../Form.svelte";

    interface Props {
        label: string,
        key: string,
        children?: () => any
    }

    const { label, key, children }: Props = $props();

    const object = getFormObject(key, 'string');
</script>

<label>
    {label}
    <select bind:value={object[key]}>
        {@render children?.()}
    </select>
</label>