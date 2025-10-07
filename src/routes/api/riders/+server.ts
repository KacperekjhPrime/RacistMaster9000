import type { Assert } from "$lib/ts/helper";
import { insert, select } from "$lib/ts/database/queryBuilder.server";
import { validateRequestJSON } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";
import type { InsertResponse, Rider } from "$lib/ts/models/databaseModels.js";

const selectAllRiders = select('Riders', ['RiderId AS riderId', 'Name AS name', 'Surname AS surname'] as const)
    .join('Schools', ['SchoolId AS schoolId', 'Name AS schoolName', 'Acronym AS schoolNameAcronym', 'City AS city'] as const, 'SchoolId')
    .prepare();

const insertRider = insert('Riders', ['Name', 'Surname', 'SchoolId'] as const).prepare();

const selectSchool = select('Schools', ['SchoolId'])
    .where('Schools.SchoolId = ?')
    .prepare<[number]>()

export function GET(): Response {
    const result = selectAllRiders.all();
    return json(result);
    type _ = Assert<Rider[], typeof result>
}

export async function POST({ request }): Promise<Response> {
    const { name, surname, schoolId } = await validateRequestJSON(request, {
        name: 'string',
        surname: 'string',
        schoolId: 'number'
    });

    if (selectSchool.get(schoolId) === undefined) error(404, 'School does not exist.');

    const result = {
        id: Number(insertRider.run(name, surname, schoolId))
    }
    type _ = Assert<InsertResponse, typeof result>;
    return json(result);
}