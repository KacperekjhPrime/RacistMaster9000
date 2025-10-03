import { insert, select } from "$lib/ts/queryBuilder";
import { validateRequestJSON } from "$lib/ts/validation.server.js";
import { json } from "@sveltejs/kit";

const selectAllSchools = select('Schools', ['SchoolId', 'Name', 'Acronym', 'City'] as const)
    .prepare();

const insertSchool = insert('Schools', ['Name', 'Acronym', 'City'] as const).prepare();

export function GET(): Response {
    return json(selectAllSchools.all());
}

export async function POST({ request }): Promise<Response> {
    const { name, acronym, city } = await validateRequestJSON(request, { name: 'string', acronym: 'string', city: 'string' });
    const { lastInsertRowid } = insertSchool.run(name, acronym, city);
    return json({ id: lastInsertRowid });
}