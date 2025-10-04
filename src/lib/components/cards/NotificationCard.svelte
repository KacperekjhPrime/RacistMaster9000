<script lang="ts">
  import Icon from "$lib/components/icons/Icon.svelte";
  import type { CardAction } from "./Card";
  import Colors from "$lib/styles/colors";
  import Icons from "$lib/components/icons/icons";
  import "./card.css";

  let {
    title,
    contents,
    buttonLeft,
    buttonRight,
    color,
    icon,
    close,
  }: {
    title: string;
    contents: string;
    buttonLeft: CardAction;
    buttonRight: CardAction;
    color: keyof typeof Colors;
    icon: keyof typeof Icons;
    close: () => void;
  } = $props();
</script>

<div class={Colors[color].class + " card"}>
  <div class="cardHeader">
    <button onclick={close}>
      <Icon size="100%" icon="close" fill="default" />
    </button>
  </div>
  <div class="cardBody">
    <h3 class="cardTitle">{title}</h3>
    <div class="cardIcon">
      <Icon size="70%" {icon} fill={color}></Icon>
    </div>
    <div class="cardText">
      {contents}
    </div>
    <div class="cardActions">
      <button class="cardAction" onclick={buttonLeft.action}>
        {buttonLeft.name}
      </button>
      <button class="cardAction" onclick={buttonRight.action}>
        {buttonRight.name}
      </button>
    </div>
  </div>
</div>
