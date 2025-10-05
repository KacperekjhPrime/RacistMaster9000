import type { Assert } from "$lib/ts/helper.js";
import { select, update } from "$lib/ts/database/queryBuilder.server";
import { intParser, makeOptional, validate, validateRequestJSON } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectOneSchool = select('Schools', ['SchoolId AS schoolId', 'Name AS name', 'Acronym AS acronym', 'City AS city'] as const)
    .where('Schools.SchoolId = ?')
    .prepare<[number]>();

export type GETResponse = {
    schoolId: number,
    name: string,
    acronym: string,
    city: string
}

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');

    const school = selectOneSchool.get(id);
    if (school === undefined) error(404);
    type _ = Assert<GETResponse, typeof school>;

    return json(school);
}

export async function PATCH({ params, request }) {
    const id = validate(params.id, intParser, 'id');
    const { name, acronym, city } = await validateRequestJSON(request, {
        name: makeOptional('string'),
        acronym: makeOptional('string'),
        city: makeOptional('string')
    });

    let builder = update('Schools', [] as const).where('Schools.SchoolId = ?');
    if (name !== undefined) {
        builder = builder.addConstant('Name', name);
    }
    if (acronym !== undefined) {
        builder = builder.addConstant('Acronym', acronym);
    }
    if (city !== undefined) {
        builder = builder.addConstant('City', city);
    }
    if (builder.affectedColumns === 0) error(400, 'At least one value to modify has to be specified.');

    const affectedRows = builder.prepareConstant<[id: number]>(id).run().changes;
    if (affectedRows === 0) error(404, `School ${id} does not exist.`);

    return new Response();
}