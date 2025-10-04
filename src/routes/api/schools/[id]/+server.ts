import { select } from "$lib/ts/queryBuilder";
import { intParser, validate } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectOneSchool = select('Schools', ['SchoolId', 'Name', 'Acronym', 'City'] as const)
    .where('Schools.SchoolId = ?')
    .prepare<[number]>();

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');

    const school = selectOneSchool.get(id);
    if (school === undefined) error(404);

    return json(school);
}