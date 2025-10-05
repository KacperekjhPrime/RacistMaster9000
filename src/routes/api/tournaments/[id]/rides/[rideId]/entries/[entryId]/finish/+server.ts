import { db } from "$lib/database/database.server.js";
import { RideEntryState, RideState } from "$lib/database/databaseSchema.server.js";
import { select, update } from "$lib/database/queryBuilder.server";
import { intParser, validate, validateRequestJSON } from "$lib/ts/validation.server.js";
import { error } from "@sveltejs/kit";

const updateRideEntry = update('RideEntries', ['TimeMilliseconds', 'RideEntryStateId'] as const)
    .where('RideEntries.RideEntryId = ?')
    .prepare<[number]>();

const updateRide = update('Rides', ['RideStateId'])
    .where('Rides.RideId = ?')
    .prepare<[number]>();

const selectNotFinishedRideEntries = select('RideEntries', ['RideEntryId'] as const)
    .where(`RideEntries.RideEntryStateId = ${RideEntryState.NotStarted}`)
    .prepare();

const selectRideEntryFromTournament = select('RideEntries', ['RideEntryId'])
    .join('Rides', [], 'RideId')
    .where('RideEntries.RideEntryId = ?')
    .where('Rides.RideId = ?')
    .where('Rides.TournamentId = ?')
    .prepare<[number, number, number]>();

export async function POST({ params, request }) {
    const tournamentId = validate(params.id, intParser, 'tournamentId');
    const rideId = validate(params.rideId, intParser, 'rideId');
    const rideEntryId = validate(params.entryId, intParser, 'rideEntryId');
    
    if (selectRideEntryFromTournament.get(rideEntryId, rideId, tournamentId) === undefined) error(404, `RideEntry ${rideEntryId} of Ride ${rideId} of Tournament ${tournamentId} does not exist.`);

    const { time } = await validateRequestJSON(request, {
        time: 'number',
    });

    db.transaction(() => {
        updateRideEntry.run(time, RideEntryState.Finished, rideEntryId)
        if (selectNotFinishedRideEntries.all().length === 0) {
            updateRide.run(RideState.Finished, rideId);
        }
    })();

    return new Response();
}