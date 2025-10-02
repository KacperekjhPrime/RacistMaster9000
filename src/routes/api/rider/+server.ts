import { insert, select } from "$lib/ts/queryBuilder";
import { intParser, validateURLParams } from "$lib/ts/validation.server";
import { error } from "@sveltejs/kit";

const selectAllStatement = select('Riders', ['RiderId', 'Name', 'Surname'] as const).prepare();

const selectOneStatement = select('Riders', ['RiderId', 'Name', 'Surname'] as const)
    .join('Schools', ['SchoolId', 'Name AS SchoolName', 'Acronym AS SchoolNameAcronym', 'City'] as const, 'SchoolId')
    .where('Riders.RiderId = ?')
    .prepare<[number]>();

const selectTournamentsStatement = select('RiderTournaments', [])
    .join('Tournament', ['TournamentId', 'Name', 'StartTimestamp', 'EndTimestamp', 'TournamentStateId'], 'TournamentId')
    .join('TournamentState', ['State'], 'TournamentStateId')
    .where('RiderTournaments.RiderId = ?')
    .prepare<[number]>();


const insertStatement = insert('Riders', ['Name', 'Surname', 'SchoolId'] as const).prepare();

export function GET({ url }) {
    if (url.searchParams.has('id')) {
        const { id } = validateURLParams(url.searchParams, { id: intParser })


        const rider = selectOneStatement.get(id);
        if (rider === undefined) error(404);

        return new Response(JSON.stringify({
            ...rider,
            Tournaments: selectTournamentsStatement.all(id)
        }));
    } else {
        return new Response(JSON.stringify(selectAllStatement.all()));
    }
}