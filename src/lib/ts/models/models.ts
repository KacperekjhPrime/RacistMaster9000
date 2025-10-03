export type School = {
  Name: string;
  City: string;
  Acronym: string;
};

export type Tournament = {
  Name: string;
  StartTimestamp: string;
  EndTimeStamp: string;
  TournamentState: TournamentState;
};

export type TournamentState = {
  State: string;
};
