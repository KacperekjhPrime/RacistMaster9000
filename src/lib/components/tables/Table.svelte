<script lang="ts" module>
    export type Column<T> = {
        key: keyof T,
        title: string
    }
</script>

<script lang="ts" generics="T">
    import { flip } from "svelte/animate";
    import Icon from "../icons/Icon.svelte";
    import "./tables.css";
    import LinkButton from "../buttons/LinkButton.svelte";

    import { slide } from "svelte/transition";
    import type { RouteId } from "$app/types";
    import { resolve } from "$app/paths";

    interface Props {
        noun: string,
        addEntryRoute: Exclude<RouteId, `${string}[${string}]${string}`>,
        modifyEntryRoute: RouteId & `${string}/[id]`,
        columns: Column<T>[],
        idKey: keyof T,
        data: T[]
    }

    let {
        noun,
        addEntryRoute,
        modifyEntryRoute,
        columns,
        idKey,
        data
    }: Props = $props();
</script>

<table>
    <thead>
        <tr>
            {#each columns as column (column.key)}
                <th>{column.title}</th>
            {/each}
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each data as row (row[idKey])}
            <tr animate:flip transition:slide>
                {#each columns as column (column.key)}
                    <td>{row[column.key]}</td>
                {/each}
                <td>
                    <LinkButton color="primary" defaultColor="transparent" link={resolve(modifyEntryRoute, { id: `${row[idKey]}` })} title="Edytuj">
                        <Icon fill="default" size="2rem" icon="more_horizontal" />
                    </LinkButton>
                </td>
            </tr>
        {/each}
    </tbody>
    <tfoot>
        <tr>
            <td colspan={columns.length + 1}>
                <LinkButton color="primary" link={resolve(addEntryRoute)}>
                    Dodaj {noun}
                </LinkButton>
            </td>
        </tr>
    </tfoot>
</table>

<style>
    table, tr, th, td {
        border: var(--secondary) 0.125rem solid;
        border-collapse: collapse;
    }

    table {
        width: 100%;
    }

    tr, th {
        height: 4rem;
    }

    tr {
        transition: var(--transition);
    }

    tr:hover {
        background-color: var(--secondary);
    }

    th {
        font-size: 1.4rem;
        font-weight: 700;
        background-color: var(--secondary);
        box-shadow: var(--secondary) 0px 0px 0.5rem 0.05rem;
    }

    td {
        text-align: center;
    }

    tfoot td > :global(*) {
        margin-left: auto;
        margin-right: auto;
    }
</style>
