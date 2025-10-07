import { insert, select } from '$lib/ts/database/queryBuilder.server.js';
import type { Assert } from '$lib/ts/helper.js';
import type { Gokart, InsertResponse } from '$lib/ts/models/databaseModels.js';
import { validateRequestJSON } from '$lib/ts/validation.server';
import { json } from '@sveltejs/kit';

const selectGokarts = select('Gokarts', ['GokartId AS gokartId', 'Name AS name'] as const)
    .prepare();

const insertGokart = insert('Gokarts', ['Name'] as const)
    .prepare();

export function GET() {
    const data = selectGokarts.all();
    type _ = Assert<Gokart[], typeof data>;
    return json(data);
}

export async function POST({ request }) {
    const { name } = await validateRequestJSON(request, { name: 'string' });
    const data = {
        id: Number(insertGokart.run(name).lastInsertRowid)
    };
    type _ = Assert<InsertResponse, typeof data>;
    return json(data);
}