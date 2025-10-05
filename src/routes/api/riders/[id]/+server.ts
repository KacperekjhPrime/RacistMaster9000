import { select, update } from "$lib/ts/database/queryBuilder.server";
import { validate, intParser, validateRequestJSON, makeOptional } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectOneRider = select('Riders', ['RiderId', 'Name', 'Surname'] as const)
    .join('Schools', ['SchoolId', 'Name AS SchoolName', 'Acronym AS SchoolNameAcronym', 'City'] as const, 'SchoolId')
    .where('Riders.RiderId = ?')
    .prepare<[id: number]>();

const selectSchool = select('Schools', ['SchoolId'])
    .where('Schools.SchoolId = ?')
    .prepare<[id: number]>();

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');
    
    const rider = selectOneRider.get(id);
    if (rider === undefined) error(404);

    return json(rider);
}

export async function PATCH({ params, request }) {
    const id = validate(params.id, intParser, 'id');
    const { name, surname, schoolId } = await validateRequestJSON(request, {
        name: makeOptional('string'),
        surname: makeOptional('string'),
        schoolId: makeOptional('number')
    });

    let builder = update('Riders', [] as const).where('Riders.RiderId = ?');
    if (name !== undefined) {
        builder = builder.addConstant('Name', name);
    }
    if (surname !== undefined) {
        builder = builder.addConstant('Surname', surname);
    }
    if (schoolId !== undefined) {
        if (selectSchool.get(schoolId) === undefined) error(404, `School ${id} does not exist.`);
        builder = builder.addConstant('SchoolId', schoolId);
    }
    if (builder.affectedColumns === 0) error(400, 'At least one value to modify has to be specified.');

    const affectedRows = builder.prepareConstant<[id: number]>(id).run().changes;
    if (affectedRows === 0) error(404, `Rider ${id} does not exist.`);

    return new Response();
}