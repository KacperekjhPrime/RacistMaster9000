<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import TournamentTable from "$lib/components/tables/TournamentTable.svelte";
  import NotificationCard from "$lib/components/cards/NotificationCard.svelte";
  import type { PageProps } from "./$types";
  import LinkCard from "$lib/components/cards/LinkCard.svelte";

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
    icon="arrow_drop_down"
    close={() => {}}
  ></NotificationCard>
  <NotificationCard
    title="title"
    contents="content"
    buttonLeft={{ name: "action1", action: () => {} }}
    buttonRight={{ name: "action2", action: () => {} }}
    color="info"
    icon="arrow_forward"
    close={() => {}}
  ></NotificationCard>
  <NotificationCard
    title="title"
    contents="content"
    buttonLeft={{ name: "action1", action: () => {} }}
    buttonRight={{ name: "action2", action: () => {} }}
    color="warning"
    icon="check"
    close={() => {}}
  ></NotificationCard>
  <NotificationCard
    title="title"
    contents="content"
    buttonLeft={{ name: "action1", action: () => {} }}
    buttonRight={{ name: "action2", action: () => {} }}
    color="error"
    icon="check_box_blank"
    close={() => {}}
  ></NotificationCard>
</div>

<h2>Link cards</h2>

<LinkCard color="info" contents="contents" title="title"></LinkCard>


<h2>End of showcase</h2>
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
  h2 {
    padding-top: 2rem;
    padding-bottom: 1rem;
  }
</style>
