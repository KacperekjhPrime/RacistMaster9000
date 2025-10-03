import { db } from "$lib/ts/database.server.js";
import { insert, select } from "$lib/ts/queryBuilder";
import { makeArray, validateRequestJSON } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectAllTournaments = select('Tournament', ['TournamentId', 'Name', 'StartTimestamp', 'EndTimestamp', 'TournamentStateId'])
    .join('TournamentState', ['State'], 'TournamentStateId')
    .prepare();

const selectTournamentState = select('TournamentState', ['TournamentStateId'])
    .where('TournamentState.TournamentStateId = ?')
    .prepare<[number]>();

const selectRider = select('Riders', ['RiderId'])
    .where('Riders.RiderId = ?')
    .prepare<[number]>();

const insertTournament = insert('Tournament', ['Name', 'StartTimestamp', 'EndTimestamp', 'TournamentStateId'] as const)
    .prepare();

const insertRiderTournament = insert('RiderTournaments', ['RiderId', 'TournamentId'] as const)
    .prepare();


export function GET(): Response {
    return json(selectAllTournaments.all());
}

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

    let tournamentId: number;
    db.transaction(() => {
        tournamentId = Number(insertTournament.run(name, startTimestamp, endTimestamp, stateId).lastInsertRowid);
        for (const id of riderIds) {
            insertRiderTournament.run(id, tournamentId);
        }
    });

    return json({ id: tournamentId! });
}