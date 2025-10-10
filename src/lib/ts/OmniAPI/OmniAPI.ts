import { resolve } from "$app/paths";
import type { RouteParams } from "$app/types";
import type { RouteId } from "$app/types";
import type { Gokart, InsertResponse, ModifyData, Ride, RideInsertResponse, Rider, RiderBase, School, TournamentBasic, TournamentBasicRaw, TournamentFull, TournamentFullRaw } from "../models/databaseModels";
import { APIError, NotFoundError } from "./APIErrors";

type Args<Route extends RouteId> = RouteParams<Route> extends Record<string, never> ? [route: Route] : [route: Route, params: RouteParams<Route>];

async function handleResponse(response: Response): Promise<unknown> {
  if (!response.ok) {
    switch (response.status) {
      case 404: throw new NotFoundError();
      default: throw new APIError(await response.text());
    }
  }
  
  const text = await response.text();
  if (text.length < 2) return;
  return JSON.parse(text);
}

export async function getAPI<Route extends RouteId>(fetch = window.fetch, ...params: [...Args<Route>]): Promise<unknown> {
  const response = await fetch(resolve(...params as any));
  return await handleResponse(response);
}

export async function postAPI<Route extends RouteId>(fetch = window.fetch, ...params: [...Args<Route>, body?: any]): Promise<unknown> {
  const response = await fetch(resolve(...params as any), {
    method: 'POST',
    body: params.at(-1) === undefined ? undefined : JSON.stringify(params.at(-1))
  });
  return await handleResponse(response);
}

export async function patchAPI<Route extends RouteId>(fetch = window.fetch, ...params: [...Args<Route>, body: any]): Promise<unknown> {
  const response = await fetch(resolve(...params as any), {
    method: 'PATCH',
    body: JSON.stringify(params.at(-1))
  });
  return await handleResponse(response);
}

export type IdType = number | string;

const OmniAPI = {
  // Schools
  async getSchools(fetch = window.fetch) {
    return await getAPI(fetch, '/api/schools') as School[];
  },
  async getSchool(id: IdType, fetch = window.fetch) {
    return await getAPI(fetch, '/api/schools/[id]', { id: id.toString() }) as School;
  },
  async addSchool(school: Omit<School, 'schoolId'>, fetch = window.fetch) {
    return await postAPI(fetch, '/api/schools', school) as InsertResponse;
  },
  async modifySchool(id: IdType, school: ModifyData<School, 'schoolId'>, fetch = window.fetch) {
    return await patchAPI(fetch, '/api/schools/[id]', { id: id.toString() }, school) as void;
  },

  // Riders
  async getRider(id: IdType, fetch = window.fetch) {
    return await getAPI(fetch, '/api/riders/[id]', { id: id.toString() }) as Rider;
  },
  async getRiders(fetch = window.fetch) {
    return await getAPI(fetch, '/api/riders') as Rider[];
  },
  async addRider(rider: Omit<RiderBase, 'riderId'>, fetch = window.fetch) {
    return await postAPI(fetch, '/api/riders', rider) as InsertResponse;
  },
  async modifyRider(id: IdType, rider: ModifyData<RiderBase, 'riderId'>, fetch = window.fetch) {
    return await patchAPI(fetch, '/api/riders/[id]', { id: id.toString() }, rider) as void;
  },

  // Tournaments
  async getTournament(id: IdType, fetch = window.fetch): Promise<TournamentFull> {
    const raw = await getAPI(fetch,'/api/tournaments/[id]', { id: id.toString() }) as TournamentFullRaw;
    return {
      tournamentId: raw.tournamentId,
      name: raw.name,
      tournamentStateId: raw.tournamentStateId,
      state: raw.state,
      riders: raw.riders,
      rides: raw.rides,
      leaderboard: raw.leaderboard,
      startDate: new Date(raw.startTimestamp * 1000),
      endDate: new Date(raw.endTimestamp * 1000)
    }
  },
  async getTournaments(fetch = window.fetch): Promise<TournamentBasic[]> {
    const data = await getAPI(fetch, '/api/tournaments') as TournamentBasicRaw[]
    return data.map(raw => {
      return {
        tournamentId: raw.tournamentId,
        name: raw.name,
        startDate: new Date(raw.startTimestamp * 1000),
        endDate: new Date(raw.endTimestamp * 1000),
        tournamentStateId: raw.tournamentStateId,
        state: raw.state
      };
    });
  },
  async addTournament(tournament: Omit<TournamentBasic, 'tournamentId'> & { riderIds: number[] }, fetch = window.fetch): Promise<InsertResponse> {
    return await postAPI(fetch, '/api/tournaments', {
      name: tournament.name,
      startTimestamp: tournament.startDate.getTime() / 1000,
      endTimestamp: tournament.startDate.getTime() / 1000,
      stateId: tournament.tournamentStateId,
      riderIds: tournament.riderIds
    }) as InsertResponse;
  },
  async modifyTournament(id: IdType, tournament: ModifyData<TournamentBasic, 'state' | 'tournamentId'>, fetch = window.fetch) {
    return await patchAPI(fetch,'/api/tournaments/[id]', { id: id.toString() }, tournament) as void;
  },

  // Gokarts
  async getGokarts(fetch = window.fetch) {
    return await getAPI(fetch, '/api/gokarts') as Gokart[];
  },
  async getGokart(id: IdType, fetch = window.fetch) {
    return await getAPI(fetch, '/api/gokarts/[id]', { id: id.toString() }) as Gokart;
  },
  async addGokart(gokart: Omit<Gokart, 'gokartId'>, fetch = window.fetch) {
    return await postAPI(fetch, '/api/gokarts', gokart) as InsertResponse;
  },
  async modifyGokart(id: IdType, gokart: ModifyData<Gokart, 'gokartId'>, fetch = window.fetch) {
    return await patchAPI(fetch, '/api/gokarts/[id]', { id: id.toString() }, gokart);
  },

  // Rides
  async getRides(tournamentId: IdType, fetch = window.fetch) {
    return await getAPI(fetch, '/api/tournaments/[id]/rides', { id: tournamentId.toString() }) as Ride[];
  },
  async getRide(tournamentId: IdType, rideId: IdType, fetch = window.fetch) {
    throw new Error('API not implemented yet.');
    return await getAPI(fetch, '/api/tournaments/[id]/rides/[rideId]', { id: tournamentId.toString(), rideId: rideId.toString() }) as Ride;
  },
  async addRide(tournamentId: IdType, fetch = window.fetch) {
    return await postAPI(fetch, '/api/tournaments/[id]/rides', { id: tournamentId.toString() }) as RideInsertResponse;
  },

  // Misc
  async disqualifyRideEntry(tournamentId: IdType, rideId: IdType, entryId: IdType, fetch = window.fetch) {
    return await postAPI(fetch, '/api/tournaments/[id]/rides/[rideId]/entries/[entryId]/disqualify', {
      id: tournamentId.toString(),
      rideId: rideId.toString(),
      entryId: entryId.toString()
    }) as void;
  },
  async finishRideEntry(tournamentId: IdType, rideId: IdType, entryId: IdType, fetch = window.fetch) {
    return await postAPI(fetch, '/api/tournaments/[id]/rides/[rideId]/entries/[entryId]/finish', {
      id: tournamentId.toString(),
      rideId: rideId.toString(),
      entryId: entryId.toString()
    }) as void;
  },
};

export default OmniAPI;
