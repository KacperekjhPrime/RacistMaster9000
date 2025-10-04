<script lang="ts">
  import Colors from "$lib/styles/colors";
  import "./buttons.css";

  let {
    onclick,
    children,
    color,
  }: { onclick: () => void; children: () => any; color: keyof typeof Colors } =
    $props();
</script>

<button class={Colors[color].class + " button"}>{@render children()}</button>
