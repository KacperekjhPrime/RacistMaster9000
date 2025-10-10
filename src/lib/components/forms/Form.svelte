<script lang="ts" module>
    const formContextKey = Symbol('Form context key');

    type FormContext<T> = {
        object: T;
        missingKeys?: Map<string, string>;
    }

    function getFormContext<T>(): FormContext<T> {
        if (__DEBUG && !hasContext(formContextKey)) throw new Error(`Cannot use getFormContext() on components that are not parents of Form.`);
        return getContext(formContextKey) as FormContext<T>;
    }

    function createContext<T extends object>(object: T): FormContext<T> {
        const context: FormContext<T> = $state({ object });
        if (__DEBUG) {
            context.missingKeys = new Map();
            for (const key in object) {
                context.missingKeys.set(key, typeof object[key]);
            }
        }

        setContext(formContextKey, context);
        return context;
    }

    export function getFormObject(key: string, type: string): Record<string, unknown> {
        const context = getFormContext<Record<string, unknown>>();
        if (__DEBUG) {
            const requiredType = context.missingKeys!.get(key);
            if (requiredType === undefined) throw new Error(`Key ${key} does not exist or has already been used on the parent form.`);
            if (type !== requiredType) throw new Error(`Key ${key} must be ${requiredType}, not ${type}.`);
            context.missingKeys!.delete(key);
        }
        return context.object;
    }

</script>

<script lang="ts" generics="T extends object">
    import type { MaybePromise } from '$lib/ts/helper';
    import type { InsertResponse } from '$lib/ts/models/databaseModels';
    import { getContext, hasContext, onMount, setContext } from 'svelte'; 
    import Button from '../buttons/Button.svelte';
    import type { IdType } from '$lib/ts/OmniAPI/OmniAPI';

    interface Props {
        noun: string,
        object: T,
        onAdd: (data: T) => MaybePromise<InsertResponse>,
        onModify: (id: IdType, data: T) => MaybePromise<void>
        onDelete?: (id: IdType) => MaybePromise<void>
        id?: IdType,
        children?: () => any
    }

    const { noun, object, onAdd, onModify, onDelete, id, children }: Props = $props();
    const context = createContext(object);
    let isFormDisabled = $state(false);

    onMount(() => {
        if (__DEBUG) {
            const missingKeys = new Array<string>();
            context.missingKeys!.forEach((v, k) => {
                missingKeys.push(`${k} (${v})`);
            });
            if (missingKeys.length > 0) throw new Error('Missing inputs on the form: ' + missingKeys.join(', '));
        }
    });

    async function disableForm(promise: MaybePromise<unknown>): Promise<void> {
        isFormDisabled = true;
        try {
            await promise;
        } finally {
            isFormDisabled = false;
        }
    }

    async function deleteFn(): Promise<void> {
        if (id !== undefined && onDelete) {
            await disableForm(onDelete(id));
            history.back();
        }
    }

    async function save(): Promise<void> {
        if (id !== undefined) {
            await disableForm(onModify(id, context.object));
        } else {
            await disableForm(onAdd(context.object));
        }
        history.back();
    }
</script>

<h2>{id !== undefined ? 'Edytuj' : 'Dodaj'} {noun}</h2>
<form onsubmit={e => e.preventDefault()}>
    <fieldset disabled={isFormDisabled}>
        {@render children?.()}
    </fieldset>
</form>
<div>
    {#if id !== undefined && onDelete}
        <Button onclick={deleteFn} color="error">Usuń</Button>
    {/if}
    <Button onclick={save} color={id !== undefined ? 'secondary' : 'primary'}>{id !== undefined ? 'Zatwierdź' : 'Dodaj'}</Button>
</div>

<style>
    form {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;

        :global(label), :global(input), :global(div) {
            width: 100%;
            outline: transparent;
            border: none;
            padding: 1rem;
        }

        :global(label) {
            padding-bottom: 0.25rem;
        }

        :global(input) {
            background-color: var(--secondary);
            color: inherit;
        }

        :global(div) {
            display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        }
    }

    fieldset {
        display: contents;
    }

    h2 {
        color: var(--header);
        letter-spacing: var(--letterSpacing);
        font-size: 1.4rem;
        font-weight: 700;
    }
</style>