<script lang="ts">
    import type { School } from "$lib/ts/models/databaseModels";
    import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";
    import Form from "./Form.svelte";
    import TextInput from "./inputs/TextInput.svelte";

    type SchoolType = Omit<School, 'schoolId'>;

    interface Props {
        id?: number,
        school?: SchoolType
    };

    const { id, school = $bindable({ name: '', acronym: '', city: '' }) }: Props = $props();
</script>

<Form noun="szkołe" object={school} onAdd={OmniAPI.addSchool} onModify={OmniAPI.modifySchool} {id}>
    <TextInput label="Nazwa" key="name" />
    <TextInput label="Akronim" key="acronym" />
    <TextInput label="Miasto" key="city" />
</Form>