import type { RouteId } from "$app/types";
import type Icons from "$lib/components/icons/icons";

export type Route = {
  title: string;
  link: RouteId;
  icon: keyof typeof Icons;
};

export type SiteData = {
  title: string;
  routes: Array<Route>;
  copyright: string;
};

export const siteData: SiteData = {
  title: "We racing ur mom",
  routes: [
    {
      title: "Strona główna",
      link: "/",
      icon: "check",
    },
    {
      title: "Gokarty",
      link: "/gokarty",
      icon: "check",
    },
    {
      title: "Kolejka",
      link: "/kolejka",
      icon: "check",
    },
    {
      title: "Szkoły",
      link: "/szkoly",
      icon: "check",
    },
    {
      title: "Zawody",
      link: "/zawody",
      icon: "check",
    }
  ],
  copyright: "© 2025 Copyright: 🐀",
};
