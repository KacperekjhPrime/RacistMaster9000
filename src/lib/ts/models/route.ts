import Icons from "$lib/components/icons/icons";

export type Route = {
  title: string;
  link: string;
  icon: keyof typeof Icons;
};
