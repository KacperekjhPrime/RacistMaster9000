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
    transparent: {
      class: "buttonTransparent",
    },
  };

  let {
    link,
    children,
    color = "default",
    defaultColor = "secondary",
  }: {
    link: string;
    children: () => any;
    color?: keyof typeof Colors;
    defaultColor?: keyof typeof DefaultColors;
  } = $props();
</script>

<a
  href={link}
  class={Colors[color].class +
    " " +
    DefaultColors[defaultColor].class +
    " button"}
>
  {@render children()}
</a>
