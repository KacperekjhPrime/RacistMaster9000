import { db } from "$lib/database/database.server.js";
import { RideEntryState } from "$lib/database/databaseSchema.server.js";
import { update } from "$lib/database/queryBuilder.server";
import { validateRequestJSON } from "$lib/ts/validation.server.js";
import { getAndValidateEntryIDs, tryFinishRide } from "../../entriesShared.server.js";

const updateRideEntry = update('RideEntries', ['TimeMilliseconds', 'RideEntryStateId'] as const)
    .where('RideEntries.RideEntryId = ?')
    .prepare<[number]>();



export async function POST({ params, request }) {
    const { rideId, rideEntryId } = getAndValidateEntryIDs(params);

    const { time } = await validateRequestJSON(request, {
        time: 'number'
    });

    db.transaction(() => {
        updateRideEntry.run(time, RideEntryState.Finished, rideEntryId)
        tryFinishRide(rideId);
    })();

    return new Response();
}