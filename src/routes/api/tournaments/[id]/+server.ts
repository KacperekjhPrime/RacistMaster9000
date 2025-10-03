import { select } from "$lib/ts/queryBuilder";
import { validate } from "$lib/ts/validation.server";
import { intParser } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectOneTournament = select('Tournament', ['TournamentId', 'Name', 'StartTimestamp', 'EndTimestamp', 'TournamentStateId'])
    .join('TournamentState', ['State'], 'TournamentStateId')
    .where('Tournament.TournamentId = ?')
    .prepare<[number]>();

const selectTournamentRiders = select('RiderTournaments', [])
    .join('Riders', ['RiderId', 'Name', 'Surname', 'SchoolId'], 'RiderId')
    .where('RiderTournaments.TournamentId = ?')
    .prepare<[number]>();

const selectRides = select('Rides', ['RideId', 'RideStateId'])
    .join('RideStates', ['State'], 'RideStateId')
    .where('Rides.TournamentId = ?')
    .prepare<[number]>();

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');

    const tournament = selectOneTournament.get(id);
    if (tournament === undefined) error(404);

    return json({
        ...tournament,
        Riders: selectTournamentRiders.all(id),
        Rides: selectRides.all(id)
    });
}