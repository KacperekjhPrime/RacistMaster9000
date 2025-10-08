import type { RouteParams } from "$app/types";
import { RideEntryState, RideState } from "$lib/ts/database/databaseStates";
import { select, update } from "$lib/ts/database/queryBuilder.server";
import { intParser, validate } from "$lib/ts/validation.server";
import { error } from "@sveltejs/kit";

const selectRideEntryFromTournament = select('RideEntries', ['RideEntryId'])
    .join('Rides', [], 'RideId')
    .where('RideEntries.RideEntryId = ?')
    .where('Rides.RideId = ?')
    .where('Rides.TournamentId = ?')
    .prepare<[number, number, number]>();

const selectNotFinishedRideEntries = select('RideEntries', ['RideEntryId'] as const)
    .where(`RideEntries.RideEntryStateId = ${RideEntryState.NotStarted}`)
    .prepare();

const updateRideState = update('Rides', ['RideStateId'])
    .where('Rides.RideId = ?')
    .prepare<[number]>();

export function getAndValidateEntryIDs(params: RouteParams<'/api/tournaments/[id]/rides/[rideId]/entries/[entryId]'>) {
    const tournamentId = validate(params.id, intParser, 'tournamentId');
    const rideId = validate(params.rideId, intParser, 'rideId');
    const rideEntryId = validate(params.entryId, intParser, 'rideEntryId');
    
    if (selectRideEntryFromTournament.get(rideEntryId, rideId, tournamentId) === undefined) error(404, `RideEntry ${rideEntryId} of Ride ${rideId} of Tournament ${tournamentId} does not exist.`);

    return {
        tournamentId,
        rideId,
        rideEntryId
    }
}

export function tryFinishRide(rideId: number): void {
    if (selectNotFinishedRideEntries.all().length > 0) return;
    updateRideState.run(RideState.Finished, rideId);
}