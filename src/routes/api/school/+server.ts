import { selectAllOrOne } from "$lib/ts/helper.js";
import { insert, select } from "$lib/ts/queryBuilder";
import { validateRequestJSON } from "$lib/ts/validation.server.js";
import { json } from "@sveltejs/kit";

const selectAllStatement = select('Schools', ['SchoolId', 'Name', 'Acronym', 'City'] as const)
    .prepare();

const selectOneStatement = select('Schools', ['SchoolId', 'Name', 'Acronym', 'City'] as const)
    .where('Schools.SchoolId = ?')
    .prepare<[number]>();

const insertStatement = insert('Schools', ['Name', 'Acronym', 'City'] as const).prepare();

export function GET({ url }): Response {
    return json(selectAllOrOne(url.searchParams, selectAllStatement, selectOneStatement));
}

export async function POST({ request }): Promise<Response> {
    const { name, acronym, city } = await validateRequestJSON(request, { name: 'string', acronym: 'string', city: 'string' });
    const { lastInsertRowid } = insertStatement.run(name, acronym, city);
    return json({ id: lastInsertRowid });
}