import { db } from "$lib/database/database.server.js";
import type { Assert } from "$lib/ts/helper.js";
import { insert, select } from "$lib/database/queryBuilder.server";
import { makeArray, validateRequestJSON } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectAllTournaments = select('Tournaments', ['TournamentId AS tournamentId', 'Name AS name', 'StartTimestamp AS startTimestamp', 'EndTimestamp AS endTimestamp', 'TournamentStateId AS tournamentStateId'] as const)
    .join('TournamentStates', ['State AS state'], 'TournamentStateId')
    .prepare();

const selectTournamentState = select('TournamentStates', ['TournamentStateId'])
    .where('TournamentStates.TournamentStateId = ?')
    .prepare<[number]>();

const selectRider = select('Riders', ['RiderId'])
    .where('Riders.RiderId = ?')
    .prepare<[number]>();

const insertTournament = insert('Tournaments', ['Name', 'StartTimestamp', 'EndTimestamp', 'TournamentStateId'] as const)
    .prepare();

const insertRiderTournament = insert('RiderTournaments', ['RiderId', 'TournamentId'] as const)
    .prepare();

export type GETResponse = {
    tournamentId: number,
    name: string,
    startTimestamp: number,
    endTimestamp: number,
    tournamentStateId: number,
    state: string
}[];

export function GET(): Response {
    const result = selectAllTournaments.all();
    type _ = Assert<GETResponse, typeof result>;
    return json(result);
}

export type POSTResponse = {
    id: number
};

export async function POST({ request }): Promise<Response> {
    const { name, startTimestamp, endTimestamp, stateId, riderIds } = await validateRequestJSON(request, {
        name: 'string',
        startTimestamp: 'number',
        endTimestamp: 'number',
        stateId: 'number',
        riderIds: makeArray('number')
    });

    if (selectTournamentState.get(stateId) === undefined) error(404, `State ${stateId} does not exist.`);

    // TODO: This is not the most efficient way to do this.
    for (const id of riderIds) {
        if (selectRider.get(id) === undefined) error(404, `Rider ${id} does not exist.`);
    }

    let id: number;
    db.transaction(() => {
        id = Number(insertTournament.run(name, startTimestamp, endTimestamp, stateId).lastInsertRowid);
        for (const id of riderIds) {
            insertRiderTournament.run(id, id);
        }
    });

    const result = {
        id: id!
    };

    type _ = Assert<POSTResponse, typeof result>;

    return json(result);
}