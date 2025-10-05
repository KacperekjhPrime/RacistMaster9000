import type { Assert } from "$lib/ts/helper.js";
import { select } from "$lib/database/queryBuilder";
import { validate } from "$lib/ts/validation.server";
import { intParser } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

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
    }[]
}

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');

    const tournament = selectOneTournament.get(id);
    if (tournament === undefined) error(404);

    const result = {
        ...tournament,
        riders: selectTournamentRiders.all(id),
        rides: selectRides.all(id)
    };

    type _ = Assert<GETResponse, typeof result>;

    return json(result);
}