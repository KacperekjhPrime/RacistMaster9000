<script lang="ts">
  import Icon from "$lib/components/icons/Icon.svelte";
  import type { CardAction } from "./Card";
  import Colors from "$lib/styles/colors";
  import Icons from "$lib/components/icons/icons";
  import "./card.css";

  let {
    title,
    contents,
    color,
  }: {
    title: string;
    contents: string;
    color: keyof typeof Colors;
  } = $props();
</script>

<div class={Colors[color].class + " card"}>
  <div class="cardHeader">
    <button><Icon size="100%" icon="close" fill="default"></Icon></button>
  </div>
  <div class="cardBody">
    <div class="cardIcon">
      <Icon size="70%" icon="star" fill={color}></Icon>
    </div>
    <div class="cardText cardTitle">
      {contents}
    </div>
  </div>
</div>
