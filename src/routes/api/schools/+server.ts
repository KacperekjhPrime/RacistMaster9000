import type { Assert } from "$lib/ts/helper.js";
import { insert, select } from "$lib/ts/database/queryBuilder.server";
import { validateRequestJSON } from "$lib/ts/validation.server.js";
import { json } from "@sveltejs/kit";
import type { InsertResponse, School } from "$lib/ts/models/databaseModels.js";

const selectAllSchools = select('Schools', ['SchoolId AS schoolId', 'Name AS name', 'Acronym AS acronym', 'City AS city'] as const)
    .prepare();

const insertSchool = insert('Schools', ['Name', 'Acronym', 'City'] as const).prepare();

export function GET(): Response {
    const result = selectAllSchools.all();
    type _ = Assert<School[], typeof result>;
    return json(result);
}

export async function POST({ request }): Promise<Response> {
    const { name, acronym, city } = await validateRequestJSON(request, { name: 'string', acronym: 'string', city: 'string' });
    const result = {
        id: Number(insertSchool.run(name, acronym, city))
    }
    type _ = Assert<InsertResponse, typeof result>;
    return json(result);
}