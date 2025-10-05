<script lang="ts">
  import Colors from "$lib/styles/colors";
  import "./buttons.css";

  const DefaultColors = {
    secondary: {
      class: "buttonSecondary",
    },
    accent: {
      class: "buttonAccent",
    },
  };

  let {
    onclick,
    children,
    color = "default",
    defaultColor = "secondary",
  }: {
    onclick: () => void;
    children: () => any;
    color?: keyof typeof Colors;
    defaultColor?: keyof typeof DefaultColors;
  } = $props();
</script>

<button
  {onclick}
  class={Colors[color].class +
    " " +
    DefaultColors[defaultColor].class +
    " button"}
>
  {@render children()}
</button>
