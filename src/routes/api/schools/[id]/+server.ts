import type { Assert } from "$lib/ts/helper.js";
import { select } from "$lib/ts/database/queryBuilder.server";
import { intParser, validate } from "$lib/ts/validation.server";
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