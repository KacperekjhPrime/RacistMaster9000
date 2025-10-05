import type { Assert } from "$lib/ts/helper.js";
import { insert, select } from "$lib/database/queryBuilder.server";
import { validateRequestJSON } from "$lib/ts/validation.server.js";
import { json } from "@sveltejs/kit";

const selectAllSchools = select('Schools', ['SchoolId AS schoolId', 'Name AS name', 'Acronym AS acronym', 'City AS city'] as const)
    .prepare();

const insertSchool = insert('Schools', ['Name', 'Acronym', 'City'] as const).prepare();

export type GETResponse = {
    schoolId: number,
    name: string,
    acronym: string,
    city: string
}[]

export function GET(): Response {
    const result = selectAllSchools.all();
    type _ = Assert<GETResponse, typeof result>;
    return json(result);
}

export type POSTResponse = {
    id: number
}

export async function POST({ request }): Promise<Response> {
    const { name, acronym, city } = await validateRequestJSON(request, { name: 'string', acronym: 'string', city: 'string' });
    const result = {
        id: Number(insertSchool.run(name, acronym, city))
    }
    type _ = Assert<POSTResponse, typeof result>;
    return json(result);
}