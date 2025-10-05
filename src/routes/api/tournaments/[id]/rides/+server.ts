import { db } from "$lib/database/database.server.js";
import type { Assert } from "$lib/ts/helper.js";
import { insert, select } from "$lib/database/queryBuilder";
import { intParser, validate } from "$lib/ts/validation.server";
import { error, json } from "@sveltejs/kit";

const selectRides = select('Rides', ['RideId AS rideId', 'RideStateId AS rideStateId', 'TournamentId AS tournamentId'] as const)
    .join('RideStates', ['State AS state'] as const, 'RideStateId')
    .where('Rides.TournamentId = ?')
    .prepare<[number]>();

const selectTournament = select('Tournaments', ['TournamentId'] as const)
    .where('Tournaments.TournamentId = ?')
    .prepare<[number]>();

const selectRideEntries = select('RideEntries', ['RideEntryId AS rideEntryId', 'RiderId AS riderId', 'GokartId AS gokartId', '"Order" AS order', 'TimeMilliseconds AS timeMilliseconds', 'RideEntryStateId AS rideEntryStateId'] as const)
    .join('RideEntryStates', ['State AS state'], 'RideEntryStateId')
    .join('Riders', ['Name AS riderName', 'Surname AS riderSurname', 'SchoolId AS schoolId'] as const, 'RiderId')
    .join('Schools', ['Name AS schoolName', 'Acronym AS schoolNameAcronym', 'City AS city'] as const, 'SchoolId')
    .join('Gokarts', ['Name AS gokartName'] as const, 'GokartId')
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

export type GETResponse = {
    rideId: number,
    rideStateId: number,
    tournamentId: number,
    state: string,
    entries: {
        rideEntryId: number,
        riderId: number,
        gokartId: number,
        order: number,
        timeMilliseconds: number | null,
        rideEntryStateId: number,
        riderName: string,
        riderSurname: string,
        schoolId: number,
        schoolName: string,
        schoolNameAcronym: string,
        city: string,
        gokartName: string
    }[]
}[]

export function GET({ params }) {
    const id = validate(params.id, intParser, 'id');
    
    if (selectTournament.get(id) === undefined) error(404, 'Tournament does not exist.');

    const result = selectRides.all(id).map(ride => { return {
        ...ride,
        entries: selectRideEntries.all(ride.rideId)
    } });

    type _ = Assert<GETResponse, typeof result>;

    return json(result);
}

export type POSTResponse = {
    rideId: number,
    entries: {
        riderId: number,
        gokartId: number,
        order: number
    }[]
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

    const entryIds = new Array<number>();
    let rideId: number;
    db.transaction(() => {
        const { lastInsertRowid: rideId } = insertRide.run(1, id);
        for (let i = 0; i < selectedGokartsForRiders.length; i++) {
            const { riderId, gokartId } = selectedGokartsForRiders[i];
            const { lastInsertRowid: entryId } = insertRideEntry.run(rideId as number, riderId, gokartId, i, 1); // TODO: Move the 1 into a separate constant
            entryIds.push(entryId as number);
        }
    })();

    const result = {
        rideId: rideId!,
        entries: selectedGokartsForRiders.map(({ riderId, gokartId }, i) => { return { entryId: entryIds[i], riderId, gokartId, order: i } })
    };
    type _ = Assert<POSTResponse, typeof result>;
    return json(result);
}