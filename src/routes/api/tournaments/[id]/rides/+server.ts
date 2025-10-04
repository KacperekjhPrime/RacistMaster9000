import { db } from "$lib/ts/database.server.js";
import { insert, select } from "$lib/ts/queryBuilder";
import { intParser, validate } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectRides = select('Rides', ['RideId', 'RideStateId', 'TournamentId'] as const)
    .join('RideStates', ['State'] as const, 'RideStateId')
    .where('Rides.TournamentId = ?')
    .prepare<[number]>();

const selectTournament = select('Tournaments', ['TournamentId'] as const)
    .where('Tournaments.TournamentId = ?')
    .prepare<[number]>();

const selectRideEntries = select('RideEntries', ['RideEntryId', 'RiderId', 'GokartId', '"Order"', 'RideEntryStateId'] as const)
    .join('RideEntryStates', ['State'], 'RideEntryStateId')
    .join('Riders', ['RiderId', 'Name', 'Surname', 'SchoolId'] as const, 'RiderId')
    .join('Schools', ['Name AS SchoolName', 'Acronym AS SchoolAcronym', 'City'] as const, 'SchoolId')
    .join('Gokarts', ['Name AS GokartName'] as const, 'GokartId')
    .where('RideEntries.RideId = ?')
    .orderBy('RideEntries."Order"', true)
    .prepare<[number]>();

const selectBasicRideEntries = select('RideEntries', ['RiderId', 'GokartId'] as const)
    .join('Rides', [], 'RideId')
    .where('Rides.TournamentId = ?')
    .prepare<[number]>();

const selectRiders = select('RiderTournaments', ['RiderId'] as const)
    .where(`RiderTournaments.TournamentId = ?`)
    .prepare<[number]>();

const selectGokarts = select('Gokarts', ['GokartId'] as const)
    .prepare();

const insertRide = insert('Rides', ['RideStateId', 'TournamentId'] as const)
    .prepare();

const insertRideEntry = insert('RideEntries', ['RideId', 'RiderId', 'GokartId', '"Order"', 'RideEntryStateId'] as const)
    .prepare();

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');
    
    if (selectTournament.get(id) === undefined) error(404, 'Tournament does not exist.');

    return json(selectRides.all(id).map(ride => { return {
        ...ride,
        Entries: selectRideEntries.all(ride.RideId)
    } }));
}

export function POST({ params }) {
    const id = validate(params.id, intParser, 'id');

    if (selectTournament.get(id) === undefined) error(404, 'Tournament does not exist.');

    const riderIds = selectRiders.all(id).map(v => v.RiderId);
    const gokartIds = selectGokarts.all().map(v => v.GokartId);

    if (riderIds.length > gokartIds.length) throw new Error(`Tournament ${id} has more riders than there are gokarts available!`);

    const tournamentQueueEntries = selectBasicRideEntries.all(id);

    const validGokartsForRiders: Record<number, Set<number>> = {};

    for (const riderId of riderIds) {
        validGokartsForRiders[riderId] = new Set(gokartIds);
    }

    for (const { RiderId, GokartId } of tournamentQueueEntries) {
        if (!(RiderId in validGokartsForRiders)) continue; // This continue should never really happen, unless the DB has been tampered with

        validGokartsForRiders[RiderId].delete(GokartId);
    }

    const freeGokarts = new Set(gokartIds);
    const selectedGokartsForRiders = new Array<{ riderId: number, gokartId: number }>();

    for (const riderId of riderIds) {
        const validGokartIds = Array.from(validGokartsForRiders[riderId].intersection(freeGokarts));
        let gokartId: number;
        if (validGokartIds.length <= 0) {
            console.warn(`There are no free gokarts that have been used by rider ${riderId} in tournament ${id}. A random, but used one will be picked instead.`);
            const freeGokartsArray = Array.from(freeGokarts);
            gokartId = freeGokartsArray[Math.floor(Math.random() * freeGokartsArray.length)];
        } else {
            gokartId = validGokartIds[Math.floor(Math.random() * validGokartIds.length)];
        }

        freeGokarts.delete(gokartId);
        const insertionIndex = Math.floor(Math.random() * (selectedGokartsForRiders.length + 1));
        selectedGokartsForRiders.splice(insertionIndex, 0, { riderId, gokartId })
    }

    db.transaction(() => {
        const { lastInsertRowid } = insertRide.run(1, id);
        for (let i = 0; i < selectedGokartsForRiders.length; i++) {
            const { riderId, gokartId } = selectedGokartsForRiders[i];
            insertRideEntry.run(lastInsertRowid as number, riderId, gokartId, i, 1); // TODO: Move the 1 into a separate constant
        }
    })();

    return json(selectedGokartsForRiders);
}