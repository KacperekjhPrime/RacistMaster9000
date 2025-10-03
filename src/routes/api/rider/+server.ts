import { selectAllOrOne } from "$lib/ts/helper.js";
import { insert, select } from "$lib/ts/queryBuilder";
import { validateRequestJSON } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectAllStatement = select('Riders', ['RiderId', 'Name', 'Surname'] as const)
    .join('Schools', ['SchoolId', 'Name AS SchoolName', 'Acronym AS SchoolNameAcronym', 'City'] as const, 'SchoolId')
    .prepare();

const selectOneStatement = select('Riders', ['RiderId', 'Name', 'Surname'] as const)
    .join('Schools', ['SchoolId', 'Name AS SchoolName', 'Acronym AS SchoolNameAcronym', 'City'] as const, 'SchoolId')
    .where('Riders.RiderId = ?')
    .prepare<[number]>();

const insertStatement = insert('Riders', ['Name', 'Surname', 'SchoolId'] as const).prepare();

const selectSchoolStatement = select('Schools', ['SchoolId'])
    .where('Schools.SchoolId = ?')
    .prepare<[number]>()

export function GET({ url }): Response {
    return json(selectAllOrOne(url.searchParams, selectAllStatement, selectOneStatement));
}

export async function POST({ request }): Promise<Response> {
    const { name, surname, schoolId } = await validateRequestJSON(request, {
        name: 'string',
        surname: 'string',
        schoolId: 'number'
    });

    if (selectSchoolStatement.get(schoolId) === undefined) error(404, 'School does not exist.');

    const { lastInsertRowid } = insertStatement.run(name, surname, schoolId);
    return json({ id: lastInsertRowid });
}