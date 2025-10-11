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

  interface Props {
    link: string,
    children: () => any
    color?: keyof typeof Colors,
    defaultColor?: keyof typeof DefaultColors,
  }

  let {
    link,
    children,
    color = "default",
    defaultColor = "secondary",
    ...rest
  }: Props & { [key: string]: any } = $props();
</script>

<a
  href={link}
  class={Colors[color].class +
    " " +
    DefaultColors[defaultColor].class +
    " button"}
  {...rest}
>
  {@render children()}
</a>
