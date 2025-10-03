export type Database = {
	Gokart: {
		GokartId: number,
		Name: string
	},
	QueueEntries: {
		QueueEntryId: number,
		RiderId: number,
		RideId: number,
		Order: number
	}
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
	Rides: {
		RideId: number,
		TournamentId: number,
		RideStateId: number
	},
	Schools: {
		SchoolId: number,
		Name: string,
		City: string,
		Acronym: string
	},
	TournamentState: {
		TournamentStateId: number,
		State: string
	},
	Tournament: {
		TournamentId: number,
		Name: string,
		StartTimestamp: number,
		EndTimestamp: number,
		TournamentStateId: number
	}
}

export const databaseSchema =
`BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Gokarts" (
	"GokartId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	PRIMARY KEY("GokartId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "QueueEntries" (
	"QueueEntryId"	INTEGER NOT NULL,
	"RiderId"	INTEGER NOT NULL,
	"RideId"	INTEGER NOT NULL,
	"Order"	INTEGER NOT NULL,
	PRIMARY KEY("QueueEntryId" AUTOINCREMENT),
	FOREIGN KEY("RideId") REFERENCES "Rides"("RideStateId"),
	FOREIGN KEY("RiderId") REFERENCES "Riders"("RiderId")
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
	FOREIGN KEY("TournamentId") REFERENCES "Tournaments"("TournamentId")
);
CREATE TABLE IF NOT EXISTS "Riders" (
	"RiderId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"Surname"	TEXT NOT NULL,
	"SchoolId"	INTEGER NOT NULL,
	PRIMARY KEY("RiderId" AUTOINCREMENT),
	FOREIGN KEY("SchoolId") REFERENCES "Schools"
);
CREATE TABLE IF NOT EXISTS "Rides" (
	"RideId"	INTEGER NOT NULL,
	"TournamentId"	INTEGER NOT NULL,
	"RideStateId"	INTEGER NOT NULL,
	PRIMARY KEY("RideId" AUTOINCREMENT),
	FOREIGN KEY("RideStateId") REFERENCES "RideStates"("RideStateId"),
	FOREIGN KEY("TournamentId") REFERENCES "Tournaments"("TournamentId")
);
CREATE TABLE IF NOT EXISTS "Schools" (
	"SchoolId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"City"	TEXT NOT NULL,
	"Acronym"	TEXT NOT NULL,
	PRIMARY KEY("SchoolId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "TournamentState" (
	"TournamentStateId"	INTEGER NOT NULL,
	"State"	TEXT NOT NULL,
	PRIMARY KEY("TournamentStateId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Tournaments" (
	"TournamentId"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"StartTimestamp"	INTEGER NOT NULL,
	"EndTimestamp"	INTEGER NOT NULL,
	"TournamentStateId"	INTEGER NOT NULL,
	PRIMARY KEY("TournamentId" AUTOINCREMENT)
);
INSERT INTO "RideStates" VALUES (1,'Nie rozpoczęty');
INSERT INTO "RideStates" VALUES (2,'W trakcie');
INSERT INTO "RideStates" VALUES (3,'Zakończony');
INSERT INTO "RideStates" VALUES (4,'Twoja mama zjadła jednego z zawodników');
INSERT INTO "TournamentState" VALUES (1,'Nie rozpoczęty');
INSERT INTO "TournamentState" VALUES (2,'W trakcie');
INSERT INTO "TournamentState" VALUES (3,'Zakończony');
COMMIT;
`