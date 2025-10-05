import { select } from "$lib/ts/database/queryBuilder.server";
import { validate, intParser } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectOneRider = select('Riders', ['RiderId', 'Name', 'Surname'] as const)
    .join('Schools', ['SchoolId', 'Name AS SchoolName', 'Acronym AS SchoolNameAcronym', 'City'] as const, 'SchoolId')
    .where('Riders.RiderId = ?')
    .prepare<[number]>();

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');
    
    const rider = selectOneRider.get(id);
    if (rider === undefined) error(404);

    return json(rider);
}