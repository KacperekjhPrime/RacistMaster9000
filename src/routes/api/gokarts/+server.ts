import { insert, select } from '$lib/ts/database/queryBuilder.server.js';
import type { Assert } from '$lib/ts/helper.js';
import { validateRequestJSON } from '$lib/ts/validation.server';
import { json } from '@sveltejs/kit';

const selectGokarts = select('Gokarts', ['GokartId AS gokartId', 'Name AS name'] as const)
    .prepare();

const insertGokart = insert('Gokarts', ['Name'] as const)
    .prepare();

export type GETResponse = {
    gokartId: number,
    name: string
}[];

export function GET() {
    const data = selectGokarts.all();
    type _ = Assert<GETResponse, typeof data>;
    return json(data);
}

export type POSTResponse = {
    id: number
}

export async function POST({ request }) {
    const { name } = await validateRequestJSON(request, { name: 'string' });
    const data = {
        id: Number(insertGokart.run(name).lastInsertRowid)
    };
    type _ = Assert<POSTResponse, typeof data>;
    return json(data);
}