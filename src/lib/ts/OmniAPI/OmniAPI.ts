import { resolve } from "$app/paths";
import type { RouteParams } from "$app/types";
import type { RouteId } from "$app/types";
import type { Gokart, InsertResponse, ModifyData, Ride, RideInsertResponse, Rider, School, TournamentBasic, TournamentBasicRaw, TournamentFull, TournamentFullRaw } from "../models/databaseModels";

type Args<Route extends RouteId> = RouteParams<Route> extends Record<string, never> ? [route: Route] : [route: Route, params: RouteParams<Route>];

export async function getAPI<Route extends RouteId>(...params: Args<Route>): Promise<unknown> {
  const response = await fetch(resolve(...params as any));
  return await response.json();
}

export async function postAPI<Route extends RouteId>(...params: [...Args<Route>, body?: any]): Promise<unknown> {
  const response = await fetch(resolve(...params as any), {
    method: 'POST',
    body: params.at(-1) === undefined ? undefined : JSON.stringify(params.at(-1))
  });
  return await response.json();
}

export async function patchAPI<Route extends RouteId>(...params: [...Args<Route>, body: any]): Promise<unknown> {
  const response = await fetch(resolve(...params as any), {
    method: 'POST',
    body: JSON.stringify(params.at(-1))
  });
  return await response.json();
}

const OmniAPI = {
  // Schools
  async getSchools() {
    return await getAPI('/api/schools') as School[];
  },
  async getSchool(id: number) {
    return await getAPI('/api/schools/[id]', { id: id.toString() }) as School;
  },
  async addSchool(school: Omit<School, 'schoolId'>) {
    return await postAPI('/api/schools', school) as InsertResponse;
  },
  async modifySchool(id: number, school: ModifyData<School, 'schoolId'>) {
    return await patchAPI('/api/schools/[id]', { id: id.toString() }, school) as void;
  },

  // Riders
  async getRider(id: number) {
    return await getAPI('/api/riders/[id]', { id: id.toString() }) as Rider;
  },
  async getRiders() {
    return await getAPI('/api/riders') as Rider[];
  },
  async addRider(rider: Omit<Rider, 'riderId'>) {
    return await postAPI('/api/riders', rider) as InsertResponse;
  },
  async modifyRider(id: number, rider: ModifyData<Rider, 'riderId'>) {
    return await patchAPI('/api/riders/[id]', { id: id.toString() }, rider) as void;
  },

  // Tournaments
  async getTournament(id: number): Promise<TournamentFull> {
    const raw = await getAPI('/api/tournaments/[id]', { id: id.toString() }) as TournamentFullRaw;
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
  async getTournaments(): Promise<TournamentBasic[]> {
    const data = await getAPI('/api/tournaments') as TournamentBasicRaw[]
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
  async addTournament(tournament: Omit<TournamentBasic, 'tournamentId'> & { riderIds: number[] }): Promise<InsertResponse> {
    return await postAPI('/api/tournaments', {
      name: tournament.name,
      startTimestamp: tournament.startDate.getTime() / 1000,
      endTimestamp: tournament.startDate.getTime() / 1000,
      stateId: tournament.tournamentStateId,
      riderIds: tournament.riderIds
    }) as InsertResponse;
  },
  async modifyTournament(id: number, tournament: ModifyData<TournamentBasic, 'state' | 'tournamentId'>) {
    return await patchAPI('/api/tournaments/[id]', { id: id.toString() }, tournament) as void;
  },

  // Gokarts
  async getGokarts() {
    return await getAPI('/api/gokarts') as Gokart[];
  },
  async getGokart(id: number) {
    return await getAPI('/api/gokarts/[id]', { id: id.toString() }) as Gokart;
  },
  async addGokart(gokart: Omit<Gokart, 'gokartId'>) {
    return await postAPI('/api/gokarts', gokart) as InsertResponse;
  },
  async modifyGokart(id: number, gokart: ModifyData<Gokart, 'gokartId'>) {
    return await patchAPI('/api/gokarts/[id]', { id: id.toString() }, gokart);
  },

  // Rides
  async getRides(tournamentId: number) {
    return await getAPI('/api/tournaments/[id]/rides', { id: tournamentId.toString() }) as Ride[];
  },
  async getRide(tournamentId: number, rideId: number) {
    throw new Error('APU not implemented yet.');
    return await getAPI('/api/tournaments/[id]/rides/[rideId]', { id: tournamentId.toString(), rideId: rideId.toString() }) as Ride;
  },
  async addRide(tournamentId: number) {
    return await postAPI('/api/tournaments/[id]/rides', { id: tournamentId.toString() }) as RideInsertResponse;
  },

  // Misc
  async disqualifyRideEntry(tournamentId: number, rideId: number, entryId: number) {
    return await postAPI('/api/tournaments/[id]/rides/[rideId]/entries/[entryId]/disqualify', {
      id: tournamentId.toString(),
      rideId: rideId.toString(),
      entryId: entryId.toString()
    }) as void;
  },
  async finishRideEntry(tournamentId: number, rideId: number, entryId: number, time: number) {
    return await postAPI('/api/tournaments/[id]/rides/[rideId]/entries/[entryId]/finish', {
      id: tournamentId.toString(),
      rideId: rideId.toString(),
      entryId: entryId.toString()
    }, {
      time
    }) as void;
  },
  async addTimePenalty(tournamentId: number, rideId: number, entryId: number, penaltyTime: number) {
    return await patchAPI('/api/tournaments/[id]/rides/[rideId]/entries/[entryId]', {
      id: tournamentId.toString(),
      rideId: rideId.toString(),
      entryId: entryId.toString()
    }, {
      penaltyTime
    }) as void;
  }
};

export default OmniAPI;
