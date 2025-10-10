<script lang="ts">
    import type { RiderBase, School } from "$lib/ts/models/databaseModels";
    import OmniAPI, { type IdType } from "$lib/ts/OmniAPI/OmniAPI";
    import Form from "./Form.svelte";
    import TextInput from "./inputs/TextInput.svelte";
    import Select from "./inputs/Select.svelte";
    import { onMount, tick } from "svelte";

    type RiderType = {
        name: string,
        surname: string,
        schoolId: string
    };

    interface Props {
        id?: IdType,
        rider?: RiderType,
        schools: School[]
    };

    function processRider(object: RiderType): Omit<RiderBase, 'riderId'> {
        return {
            name: object.name,
            surname: object.surname,
            schoolId: parseInt(object.schoolId as string)
        }
    }

    async function addRider(object: RiderType) {
        return await OmniAPI.addRider(processRider(object));
    }

    async function modifyRider(id: IdType, object: RiderType) {
        await OmniAPI.modifyRider(id, processRider(object));
    }

    const { id, rider = $bindable({ name: '', surname: '', schoolId: '-1' }), schools }: Props = $props();
</script>

<Form noun="zawodnika" object={rider} onAdd={addRider} onModify={modifyRider} {id}>
    <TextInput label="Imię" key="name" />
    <TextInput label="Nazwisko" key="surname" />
    <Select label="Szkoła" key="schoolId">
        {#each schools as school}
            <option value={school.schoolId.toString()}>{school.name}</option>
        {/each}
    </Select>
</Form>