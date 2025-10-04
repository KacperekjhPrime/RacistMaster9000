<script lang="ts">
  import NotificationCard from "$lib/components/cards/NotificationCard.svelte";
  import type { PageProps } from "./$types";
  import LinkCard from "$lib/components/cards/LinkCard.svelte";
  import Sidebar from "$lib/components/navigation/Sidebar.svelte";
  import DummyThickData from "$lib/ts/dummyThickData/dummyThickData";

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
<div class="cards">
  <LinkCard color="success" contents="contents" link="/" icon="circle"
  ></LinkCard>

  <LinkCard color="info" contents="contents" link="/" icon="close"></LinkCard>

  <LinkCard color="warning" contents="contents" link="/" icon="more_horizontal"
  ></LinkCard>

  <LinkCard color="error" contents="contents" link="/" icon="more_vertical"
  ></LinkCard>
</div>
<h2>End of showcase</h2>

<Sidebar routes={DummyThickData.routes}></Sidebar>

<style>
  .cards {
    width: 100%;
    height: fit-content;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    row-gap: 1rem;
    column-gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  h2 {
    padding-top: 2rem;
    padding-bottom: 1rem;
  }
</style>
