import { update } from "$lib/ts/database/queryBuilder.server";
import { makeOptional, validateRequestJSON } from "$lib/ts/validation.server";
import { error } from "@sveltejs/kit";
import { getAndValidateEntryIDs } from "../entriesShared.server";

export async function PATCH({ request, params }) {
    const { rideEntryId } = getAndValidateEntryIDs(params);

    const { timeMilliseconds, penaltyMilliseconds } = await validateRequestJSON(request, {
        timeMilliseconds: makeOptional('number'),
        penaltyMilliseconds: makeOptional('number')
    });

    const builder = update('RideEntries', [] as const).where('RideEntries.RideEntryId = ?');
    if (timeMilliseconds !== undefined) {
        builder.addConstant('TimeMilliseconds', timeMilliseconds);
    }
    if (penaltyMilliseconds !== undefined) {
        builder.addConstant('PenaltyMilliseconds', penaltyMilliseconds);
    }
    if (builder.affectedColumns === 0) error(400, 'At least one value to modify has to be specified.');

    const affectedRows = builder.prepareConstant<[id: number]>(rideEntryId).run().changes;
    if (affectedRows === 0) error(404, `Tournament ${rideEntryId} does not exist.`);

    return new Response();
}