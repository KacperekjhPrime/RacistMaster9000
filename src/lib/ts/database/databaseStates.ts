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

export enum RideState {
	NotStarted = 1,
	InProgres,
	Finished
}

export enum TournamentState {
	NotStarted = 1,
	InProgress,
	Finished
}