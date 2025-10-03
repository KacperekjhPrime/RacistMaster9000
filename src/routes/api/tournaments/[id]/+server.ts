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

const selectQueueEntries = select('Queue', ['QueuePosition', 'RideStateId'])
    .join('Riders', ['RiderId', 'Name AS RiderName', 'Surname AS RiderSurname'] as const, 'RiderId')
    .join('Gokart', ['GokartId', 'Name AS GokartName'] as const, 'GokartId')
    .join('RideStates', ['RideStateId', 'State AS RideState'] as const, 'RideStateId')
    .where('Queue.TournamentId = ?')
    .orderBy('Queue.QueuePosition', true)
    .prepare<[number]>();

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');

    const tournament = selectOneTournament.get(id);
    if (tournament === undefined) error(404);

    return json({
        ...tournament,
        Riders: selectTournamentRiders.all(id),
        Queue: selectQueueEntries.all(id)
    });
}