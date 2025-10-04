<!--
  @component
  ### Unified icon display
  @param size - size in css' units
  @param fill - color of filling, currently required can be overriden in 'css' prop
  @param css - css class addedd to icon
  @param icon - 'icon' from 'icons' array
-->

<script lang="ts">
  import Colors from "$lib/styles/colors";
  import Icons from "../theming/icons";

  let {
    size = "24px",
    icon = "star",
    fill = "default",
  }: {
    size: string;
    icon: keyof typeof Icons;
    fill: keyof typeof Colors;
  } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  height={size}
  viewBox={Icons[icon].viewBox}
  width={size}
  class={Colors[fill].class}
>
  <path d={Icons[icon].path} />
</svg>

<style>
  svg,
  svg path {
    fill: var(--color);
  }
</style>
