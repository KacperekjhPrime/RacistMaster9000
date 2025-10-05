import type { Assert } from "$lib/ts/helper.js";
import { select, update } from "$lib/ts/database/queryBuilder.server";
import { makeOptional, validate, validateRequestJSON } from "$lib/ts/validation.server";
import { intParser } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";
import { RideEntryState } from "$lib/ts/database/databaseSchema.server.js";

const selectOneTournament = select('Tournaments', ['TournamentId AS tournamentId', 'Name AS name', 'StartTimestamp AS startTimestamp', 'EndTimestamp AS endTimestamp', 'TournamentStateId AS tournamentStateId'] as const)
    .join('TournamentStates', ['State AS state'] as const, 'TournamentStateId')
    .where('Tournaments.TournamentId = ?')
    .prepare<[number]>();

const selectTournamentRiders = select('RiderTournaments', [])
    .join('Riders', ['RiderId AS riderId', 'Name AS name', 'Surname AS surname', 'SchoolId AS schoolId'] as const, 'RiderId')
    .where('RiderTournaments.TournamentId = ?')
    .prepare<[number]>();

const selectRides = select('Rides', ['RideId AS rideId', 'RideStateId AS rideStateId'] as const)
    .join('RideStates', ['State AS state'] as const, 'RideStateId')
    .where('Rides.TournamentId = ?')
    .prepare<[number]>();

const selectLeaderboard = select('RideEntries', ['MIN(TimeMilliseconds) AS bestTime', 'RiderId AS riderId'] as const)
    .join('Rides', [] as const, 'RideId')
    .join('Riders', ['Name AS riderName', 'Surname AS riderSurname', 'SchoolId AS schoolId'] as const, 'RiderId')
    .join('Schools', ['Acronym AS schoolNameAcronym'] as const, 'SchoolId')
    .groupBy('RiderId')
    .where(`RideEntries.RideEntryStateId = ${RideEntryState.Finished}`)
    .where(`Rides.TournamentId = ?`)
    .orderBy('bestTime', true)
    .prepare<[tournamentId: number]>();

export type GETResponse = {
    tournamentId: number,
    name: string,
    startTimestamp: number,
    endTimestamp: number,
    tournamentStateId: number
    riders: {
        riderId: number,
        name: string,
        surname: string,
        schoolId: number
    }[],
    rides: {
        rideId: number,
        rideStateId: number
        state: string
    }[],
    leaderboard: {
        riderId: number,
        riderName: string,
        riderSurname: string,
        schoolId: number,
        schoolNameAcronym: string,
        bestTime: number
    }[]
}

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');

    const tournament = selectOneTournament.get(id);
    if (tournament === undefined) error(404);

    const result = {
        ...tournament,
        riders: selectTournamentRiders.all(id),
        rides: selectRides.all(id),
        leaderboard: selectLeaderboard.all(id)
    };

    type _ = Assert<GETResponse, typeof result>;

    return json(result);
}

export async function PATCH({ params, request }) {
    const id = validate(params.id, intParser, 'id');
    const { name, startTimestamp, endTimestamp } = await validateRequestJSON(request, {
        name: makeOptional('string'),
        startTimestamp: makeOptional('number'),
        endTimestamp: makeOptional('number'),
    });

    let builder = update('Tournaments', [] as const).where('Tournaments.TournamentId = ?');
    if (name !== undefined) {
        builder.addConstant('Name', name);
    }
    if (startTimestamp !== undefined) {
        builder.addConstant('StartTimestamp', startTimestamp);
    }
    if (endTimestamp !== undefined) {
        builder.addConstant('EndTimestamp', endTimestamp);
    }
    if (builder.affectedColumns === 0) error(400, 'At least one value to modify has to be specified.');

    const affectedRows = builder.prepareConstant<[id: number]>(id).run().changes;
    if (affectedRows === 0) error(404, `Tournament ${id} does not exist.`);

    return new Response();
}