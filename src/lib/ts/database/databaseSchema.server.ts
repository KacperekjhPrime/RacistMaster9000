export type Database = {
	Gokarts: {
		GokartId: number,
		Name: string
	},
	RideEntries: {
		RideEntryId: number,
		RiderId: number,
		RideId: number,
		GokartId: number,
		Order: number,
		TimeMilliseconds: number | null
		RideEntryStateId: number
	},
	RideEntryStates: {
		RideEntryStateId: number,
		State: string
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
	TournamentStates: {
		TournamentStateId: number,
		State: string
	},
	Tournaments: {
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
CREATE TABLE IF NOT EXISTS "RideEntries" (
	"RideEntryId"	INTEGER NOT NULL,
	"RiderId"	INTEGER NOT NULL,
	"RideId"	INTEGER NOT NULL,
	"GokartId"	INTEGER NOT NULL,
	"Order"	INTEGER NOT NULL,
	"TimeMilliseconds"	INTEGER DEFAULT NULL,
	"RideEntryStateId"	INTEGER NOT NULL,
	PRIMARY KEY("RideEntryId" AUTOINCREMENT),
	FOREIGN KEY("GokartId") REFERENCES "Gokarts"("GokartId"),
	FOREIGN KEY("RideEntryStateId") REFERENCES "RideEntryStates"("RideEntryStateId"),
	FOREIGN KEY("RideId") REFERENCES "Rides"("RideId"),
	FOREIGN KEY("RiderId") REFERENCES "Riders"("RiderId")
);
CREATE TABLE IF NOT EXISTS "RideEntryStates" (
	"RideEntryStateId"	INTEGER NOT NULL,
	"State"	TEXT NOT NULL,
	PRIMARY KEY("RideEntryStateId" AUTOINCREMENT)
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
CREATE TABLE IF NOT EXISTS "TournamentStates" (
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
INSERT OR REPLACE INTO "RideEntryStates" VALUES (1,'Nierozpoczęty');
INSERT OR REPLACE INTO "RideEntryStates" VALUES (2,'Zakończony');
INSERT OR REPLACE INTO "RideEntryStates" VALUES (3,'Dyskwalifikowany');
INSERT OR REPLACE INTO "RideStates" VALUES (1,'Nierozpoczęty');
INSERT OR REPLACE INTO "RideStates" VALUES (2,'W trakcie');
INSERT OR REPLACE INTO "RideStates" VALUES (3,'Zakończony');
INSERT OR REPLACE INTO "TournamentStates" VALUES (1,'Nierozpoczęty');
INSERT OR REPLACE INTO "TournamentStates" VALUES (2,'W trakcie');
INSERT OR REPLACE INTO "TournamentStates" VALUES (3,'Zakończony');
CREATE INDEX IF NOT EXISTS "RideEntriesGokartId" ON "RideEntries" (
	"GokartId"	ASC
);
CREATE INDEX IF NOT EXISTS "RideEntriesRideEntryStateId" ON "RideEntries" (
	"RideEntryStateId"	ASC
);
CREATE INDEX IF NOT EXISTS "RideEntriesRideId" ON "RideEntries" (
	"RideId"	ASC
);
CREATE INDEX IF NOT EXISTS "RideEntriesRiderId" ON "RideEntries" (
	"RiderId"	ASC
);
CREATE INDEX IF NOT EXISTS "RiderSchoolId" ON "Riders" (
	"SchoolId"	ASC
);
CREATE INDEX IF NOT EXISTS "RiderTournamentsRiderId" ON "RiderTournaments" (
	"RiderId"	ASC
);
CREATE INDEX IF NOT EXISTS "RiderTournamentsTournamentId" ON "RiderTournaments" (
	"TournamentId"
);
CREATE INDEX IF NOT EXISTS "TournamentsTournamentStateId" ON "Tournaments" (
	"TournamentStateId"	ASC
);
COMMIT;`