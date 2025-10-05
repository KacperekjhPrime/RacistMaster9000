import type { Api } from "../models/api";
import type { School } from "../models/databaseModels";

const OmniAPI: Api = {
  getSchools() {
    return [
      {
        Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
        City: "Limanowa",
        Acronym: "ZSTiO",
      },
      {
        Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
        City: "Limanowa",
        Acronym: "ZSTiO",
      },
      {
        Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
        City: "Limanowa",
        Acronym: "ZSTiO",
      },
      {
        Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
        City: "Limanowa",
        Acronym: "ZSTiO",
      },
      {
        Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
        City: "Limanowa",
        Acronym: "ZSTiO",
      },
    ];
  },
  addSchool(school: School) {},
  getSchool(acronym: string) {
    return this.getSchools()[0];
  },
};

export default OmniAPI;
