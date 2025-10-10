<script lang="ts">
    import type { Gokart } from "$lib/ts/models/databaseModels";
    import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";
    import Form from "./Form.svelte";
    import TextInput from "./inputs/TextInput.svelte";

    type GokartType = Omit<Gokart, 'gokartId'>;

    interface Props {
        id?: number,
        gokart?: GokartType
    };

    const { id, gokart = $bindable({ name: '' }) }: Props = $props();
</script>

<Form noun="gokart" object={gokart} onAdd={OmniAPI.addGokart} onModify={OmniAPI.modifyGokart} {id}>
    <TextInput label="Nazwa" key="name" />
</Form>