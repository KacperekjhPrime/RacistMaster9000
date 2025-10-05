import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
  return {
    data: params.school,
  };
}) satisfies PageLoad;
