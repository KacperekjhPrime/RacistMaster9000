import { getAndValidateEntryIDs, tryFinishRide } from "../../entriesShared.server";
import { update } from "$lib/ts/database/queryBuilder.server";
import { db } from "$lib/ts/database/database.server";
import { RideEntryState } from "$lib/ts/database/databaseStates";

const updateEntryState = update('RideEntries', ['RideEntryStateId'])
    .where('RideEntries.RideEntryId = ?')
    .prepare<[entryId: number]>();

export async function POST({ params }) {
    const { rideId, rideEntryId } = getAndValidateEntryIDs(params);

    db.transaction(() => {
        updateEntryState.run(RideEntryState.Disqualified, rideEntryId);
        tryFinishRide(rideId);
    })();

    return new Response();
}