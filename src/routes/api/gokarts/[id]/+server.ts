import { select, update } from "$lib/ts/database/queryBuilder.server";
import type { Assert } from "$lib/ts/helper";
import { intParser, makeOptional, validate, validateRequestJSON } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectGokart = select('Gokarts', ['GokartId AS gokartId', 'Name AS name'] as const)
    .where('Gokarts.GokartId = ?')
    .prepare<[number]>();

export type GETResponse = {
    gokartId: number,
    name: string
};

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');
    const data = selectGokart.get(id);
    if (data === undefined) error(404, `Gokart ${id} does not exist.`);
    type _ = Assert<GETResponse, typeof data>;
    return json(data);
}

export async function PATCH({ params, request }) {
    const id = validate(params.id, intParser, 'id');
    const { name } = await validateRequestJSON(request, {
        name: makeOptional('string'),
    });

    let builder = update('Gokarts', [] as const).where('Gokarts.GokartId = ?');
    if (name !== undefined) {
        builder = builder.addConstant('Name', name);
    }
    if (builder.affectedColumns === 0) error(400, 'At least one value to modify has to be specified.');

    const affectedRows = builder.prepareConstant<[id: number]>(id).run().changes;
    if (affectedRows === 0) error(404, `Gokart ${id} does not exist.`);

    return new Response();
}