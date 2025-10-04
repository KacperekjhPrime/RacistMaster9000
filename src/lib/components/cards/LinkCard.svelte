<script lang="ts">
  import Icon from "$lib/components/icons/Icon.svelte";
  import type { CardAction } from "./Card";
  import Colors from "$lib/styles/colors";
  import Icons from "$lib/components/icons/icons";
  import "./card.css";

  let {
    contents,
    color,
    link,
    icon,
  }: {
    contents: string;
    color: keyof typeof Colors;
    link: string;
    icon: keyof typeof Icons;
  } = $props();
</script>

<a class={Colors[color].class + " card cardLink"} href={link}>
  <div class="cardBody">
    <div class="cardIcon">
      <Icon size="70%" {icon} fill={color}></Icon>
    </div>
    <div class="cardText cardTitle">
      {contents}
    </div>
  </div>
</a>
