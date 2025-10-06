import type { PageLoad } from "./$types";
import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";
import { error } from "@sveltejs/kit";

export const load = (async ({ params }) => {
  const id = parseInt(params.school);
  if (isNaN(id)) error(404);

  return {
    school: await OmniAPI.getSchool(id),
  };
}) satisfies PageLoad;
