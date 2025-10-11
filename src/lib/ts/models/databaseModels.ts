export type ModifyData<T extends object, IdKey extends keyof T> = Partial<Omit<T, IdKey>>;

export type InsertResponse = {
  id: number
}

export type School = {
  schoolId: number;
  name: string;
  city: string;
  acronym: string;
};

export type RiderBase = {
  riderId: number,
  name: string,
  surname: string,
  schoolId: number
}

export type Rider = RiderBase & {
  schoolName: string,
  schoolNameAcronym: string,
  city: string
}

type TournamentFullBase = {
  tournamentId: number,
  name: string,
  tournamentStateId: number,
  state: string,
  riders: {
    riderId: number,
    name: string,
    surname: string,
    schoolId: number
  }[],
  rides: {
    rideId: number,
    rideStateId: number
    state: string
  }[],
  leaderboard: {
    riderId: number,
    riderName: string,
    riderSurname: string,
    schoolId: number,
    schoolNameAcronym: string,
    bestTime: number
  }[]
}

export type TournamentFullRaw = TournamentFullBase & {
  startTimestamp: number,
  endTimestamp: number,
}

export type TournamentFull = TournamentFullBase & {
  startDate: Date,
  endDate: Date,
}

type TournamentBasicBase = {
  tournamentId: number,
  name: string;
  tournamentStateId: number;
  state: string;
}

export type TournamentBasicRaw = TournamentBasicBase & {
  startTimestamp: number;
  endTimestamp: number;
};

export type TournamentBasic = TournamentBasicBase & {
  startDate: Date;
  endDate: Date;
};

export type Gokart = {
  gokartId: number,
  name: string
}

export type RideEntry = {
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
}

export type Ride = {
  rideId: number,
  rideStateId: number,
  tournamentId: number,
  state: string,
  entries: RideEntry[]
}

export type RideInsertResponse = {
  rideId: number,
  entries: {
    entryId: number,
    riderId: number,
    gokartId: number,
    order: number
  }[]
}

export enum RideEntryState {
  NotStarted = 1,
  Finished,
  Disqualified,
  InProgress // Not in database yet
}

export const RideEntryStatesReadable: {[K in RideEntryState]: string} = {
  [RideEntryState.NotStarted]: "Oczekujący",
  [RideEntryState.Finished]: "Zakończony",
  [RideEntryState.Disqualified]: "Zdyskwalifikowany",
  [RideEntryState.InProgress]: "W trakcie"
}