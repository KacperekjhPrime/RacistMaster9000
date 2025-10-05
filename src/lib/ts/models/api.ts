import type { School } from "./databaseModels";

export type Api = {
  getSchools(): Array<School>;
  addSchool(school: School): void;
};
