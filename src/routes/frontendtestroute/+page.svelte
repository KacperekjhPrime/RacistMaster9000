<script lang="ts">
  import Button from "$lib/components/atoms/Button.svelte";
  import TournamentTable from "$lib/components/organisms/tables/TournamentTable.svelte";
  import NotificationCard from "$lib/components/atoms/NotificationCard.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<h1>
  If you got here it's probably by accident. I test here components in isolation
  please go back to <a href="/">home page</a>
</h1>

<h2>Notification cards showcase</h2>
<div class="cards">
  <NotificationCard
    title="title"
    contents="content"
    buttonLeft={{ name: "action1", action: () => {} }}
    buttonRight={{ name: "action2", action: () => {} }}
    color="success"
  ></NotificationCard>
  <NotificationCard
    title="title"
    contents="content"
    buttonLeft={{ name: "action1", action: () => {} }}
    buttonRight={{ name: "action2", action: () => {} }}
    color="info"
  ></NotificationCard><NotificationCard
    title="title"
    contents="content"
    buttonLeft={{ name: "action1", action: () => {} }}
    buttonRight={{ name: "action2", action: () => {} }}
    color="warning"
  ></NotificationCard><NotificationCard
    title="title"
    contents="content"
    buttonLeft={{ name: "action1", action: () => {} }}
    buttonRight={{ name: "action2", action: () => {} }}
    color="error"
  ></NotificationCard>
</div>

<h2>Link cards</h2>

<style>
  .cards {
    width: 100%;
    height: fit-content;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    row-gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  h2{
    padding-top: 2rem;
    padding-bottom: 1rem;
  }
</style>
