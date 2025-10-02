export type Database = {
	Gokart: {
		GokartId: number,
		Name: string
	},
	Queue: {
		QueueId: number,
		RiderId: number,
		TournamentId: number,
		QueuePosition: number,
		GokartId: number,
		RideStateId: number,
	},
	RideStates: {
		RideStateId: number,
		State: string
	},
	RiderTournaments: {
		RiderTournamentsId: number,
		RiderId: number,
		TournamentId: number
	},
	Riders: {
		RiderId: number,
		Name: string,
		Surname: string,
		SchoolId: number
	},
	Schools: {
		SchoolId: number,
		Name: string,
		City: string,
		Acronym: string
	},
	Tournament: {
		TournamentId: number,
		Name: string,
		StartTimestamp: number,
		EndTimestamp: number,
		TournamentStateId: number
	},
	TournamentState: {
		TournamentStateId: number,
		State: string
	}
}

export const databaseSchema =
`BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Gokart" (
	"GokartId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	PRIMARY KEY("GokartId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Queue" (
	"QueueId"	INTEGER NOT NULL,
	"RiderId"	INTEGER NOT NULL,
	"TournamentId"	INTEGER NOT NULL,
	"QueuePosition"	INTEGER NOT NULL,
	"GokartId"	INTEGER NOT NULL,
	"RideStateId"	INTEGER NOT NULL,
	PRIMARY KEY("QueueId" AUTOINCREMENT),
	FOREIGN KEY("GokartId") REFERENCES "Gokart"("GokartId"),
	FOREIGN KEY("RideStateId") REFERENCES "RideStates"("RideStateId"),
	FOREIGN KEY("TournamentId") REFERENCES "Tournament"("TournamentId")
);
CREATE TABLE IF NOT EXISTS "RideStates" (
	"RideStateId"	INTEGER NOT NULL,
	"State"	TEXT NOT NULL,
	PRIMARY KEY("RideStateId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "RiderTournaments" (
	"RiderTournamentsId"	INTEGER NOT NULL,
	"RiderId"	INTEGER NOT NULL,
	"TournamentId"	INTEGER NOT NULL,
	PRIMARY KEY("RiderTournamentsId" AUTOINCREMENT),
	FOREIGN KEY("TournamentId") REFERENCES "Tournament"("TournamentId")
);
CREATE TABLE IF NOT EXISTS "Riders" (
	"RiderId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"Surname"	TEXT NOT NULL,
	"SchoolId"	INTEGER NOT NULL,
	PRIMARY KEY("RiderId" AUTOINCREMENT),
	FOREIGN KEY("SchoolId") REFERENCES "Schools"
);
CREATE TABLE IF NOT EXISTS "Schools" (
	"SchoolId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"City"	TEXT NOT NULL,
	"Acronym"	TEXT NOT NULL,
	PRIMARY KEY("SchoolId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Tournament" (
	"TournamentId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"StartTimestamp"	INTEGER NOT NULL,
	"EndTimestamp"	INTEGER NOT NULL,
	"TournamentStateId"	INTEGER NOT NULL,
	PRIMARY KEY("TournamentId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "TournamentState" (
	"TournamentStateId"	INTEGER NOT NULL,
	"State"	TEXT NOT NULL,
	PRIMARY KEY("TournamentStateId" AUTOINCREMENT)
);
CREATE INDEX IF NOT EXISTS "QueueGokartId" ON "Queue" (
	"GokartId"	ASC
);
CREATE INDEX IF NOT EXISTS "QueueRideStatusId" ON "Queue" (
	"RideStateId"	ASC
);
CREATE INDEX IF NOT EXISTS "QueueTournamentId" ON "Queue" (
	"TournamentId"	ASC
);
CREATE INDEX IF NOT EXISTS "RiderSchoolId" ON "Riders" (
	"SchoolId"	ASC
);
CREATE INDEX IF NOT EXISTS "RiderTournamentRiderd" ON "RiderTournaments" (
	"RiderId"	ASC
);
CREATE INDEX IF NOT EXISTS "RiderTournamentTournamentId" ON "RiderTournaments" (
	"TournamentId"	ASC
);
CREATE INDEX IF NOT EXISTS "TournamentTournamentStateId" ON "Tournament" (
	"TournamentStateId"	ASC
);
COMMIT;`