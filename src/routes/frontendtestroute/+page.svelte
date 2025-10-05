<script lang="ts">
  import NotificationCard from "$lib/components/cards/NotificationCard.svelte";
  import type { PageProps } from "./$types";
  import NavigationSidebarLinkCard from "$lib/components/cards/NavigationSidebarLinkCard.svelte";
  import Sidebar from "$lib/components/navigation/Sidebar.svelte";
  import LinkCard from "$lib/components/cards/LinkCard.svelte";
  import DummyThickData from "$lib/ts/dummyThickData/dummyThickData";
  import Button from "$lib/components/buttons/Button.svelte";
  import Select from "$lib/components/Select/Select.svelte";
  import Option from "$lib/components/Select/Option.svelte";

  let { data }: PageProps = $props();
</script>

<Sidebar routes={DummyThickData.routes}></Sidebar>
<main>
  <h1>
    If you got here it's probably by accident. I test here components in
    isolation please go back to <a href="/">home page</a>
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
    <LinkCard
      color="success"
      contents="content"
      icon="refresh"
      link="/Dashboard"
    ></LinkCard>
    <LinkCard color="info" contents="content" icon="refresh" link="/Dashboard"
    ></LinkCard>
    <LinkCard
      color="warning"
      contents="content"
      icon="refresh"
      link="/Dashboard"
    ></LinkCard>
    <LinkCard color="error" contents="content" icon="refresh" link="/Dashboard"
    ></LinkCard>
  </div>
  <h2>Sidebar link cards</h2>
  <div class="cards">
    <NavigationSidebarLinkCard
      color="success"
      contents="contents"
      link="/"
      icon="circle"
    ></NavigationSidebarLinkCard>

    <NavigationSidebarLinkCard
      color="info"
      contents="contents"
      link="/"
      icon="close"
    ></NavigationSidebarLinkCard>

    <NavigationSidebarLinkCard
      color="warning"
      contents="contents"
      link="/"
      icon="more_horizontal"
    ></NavigationSidebarLinkCard>

    <NavigationSidebarLinkCard
      color="error"
      contents="contents"
      link="/"
      icon="more_vertical"
    ></NavigationSidebarLinkCard>
  </div>

  <h2>Buttons</h2>
  <div class="display">
    <div class="container">
      <Button onclick={() => {}} color="success">Careless</Button>
    </div>
    <div class="container">
      <Button onclick={() => {}} color="info">Pompeii</Button>
    </div>
    <div class="container">
      <Button onclick={() => {}} color="warning">Best of me</Button>
    </div>
    <div class="container">
      <Button onclick={() => {}} color="error">Rumors</Button>
    </div>
  </div>

  <h2>Select</h2>
  <div class="display">
    <Select>
      <Option name="love"></Option>
      <Option name="uwu"></Option>
      <Option name="Kacper"></Option>
      <Option name="Lufurus"></Option>
    </Select>
  </div>

  <h2>Table</h2>
  <div class="display"></div>
</main>

<style>
  main {
    margin-left: 6rem;
    margin-right: 6rem;
  }
  .cards {
    padding: 1rem;
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
  .display {
    padding: 1rem;
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .container {
    width: 20rem;
    height: 2rem;
    margin: 1rem;
  }
  h2 {
    padding-top: 2rem;
    padding-bottom: 1rem;
  }
</style>
