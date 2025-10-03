import { insert, select } from "$lib/ts/queryBuilder";
import { validateRequestJSON } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectAllRiders = select('Riders', ['RiderId', 'Name', 'Surname'] as const)
    .join('Schools', ['SchoolId', 'Name AS SchoolName', 'Acronym AS SchoolNameAcronym', 'City'] as const, 'SchoolId')
    .prepare();

const insertRider = insert('Riders', ['Name', 'Surname', 'SchoolId'] as const).prepare();

const selectSchool = select('Schools', ['SchoolId'])
    .where('Schools.SchoolId = ?')
    .prepare<[number]>()

export function GET(): Response {
    return json(selectAllRiders.all());
}

export async function POST({ request }): Promise<Response> {
    const { name, surname, schoolId } = await validateRequestJSON(request, {
        name: 'string',
        surname: 'string',
        schoolId: 'number'
    });

    if (selectSchool.get(schoolId) === undefined) error(404, 'School does not exist.');

    const { lastInsertRowid } = insertRider.run(name, surname, schoolId);
    return json({ id: lastInsertRowid });
}