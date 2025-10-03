<script lang="ts">
  import SchoolsTable from "$lib/components/organisms/tables/SchoolsTable.svelte";
  import type { School } from "$lib/ts/models/models";

  let schools: Array<School> = [
    {
      name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      city: "Limanowa",
      acronym: "ZSTiO",
    },{
      name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      city: "Limanowa",
      acronym: "ZSTiO",
    },{
      name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      city: "Limanowa",
      acronym: "ZSTiO",
    },{
      name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      city: "Limanowa",
      acronym: "ZSTiO",
    },{
      name: "Zespół Szkół Technicznych i Ogólnokształcących Imienia Jana Pawła II",
      city: "Limanowa",
      acronym: "ZSTiO",
    },
  ];
</script>

<SchoolsTable {schools}></SchoolsTable>
