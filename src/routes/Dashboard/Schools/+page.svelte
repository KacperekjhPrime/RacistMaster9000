<script lang="ts">
  import SchoolsTable from "$lib/components/organisms/tables/SchoolsTable.svelte";
  import type { School } from "$lib/ts/models/models";

  let schools: Array<School> = [
    {
      Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      City: "Limanowa",
      Acronym: "ZSTiO",
    },{
      Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      City: "Limanowa",
      Acronym: "ZSTiO",
    },{
      Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      City: "Limanowa",
      Acronym: "ZSTiO",
    },{
      Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      City: "Limanowa",
      Acronym: "ZSTiO",
    },{
      Name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      City: "Limanowa",
      Acronym: "ZSTiO",
    },
  ];
</script>

<SchoolsTable {schools}></SchoolsTable>
