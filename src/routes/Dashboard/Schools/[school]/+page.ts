import type { PageLoad } from "./$types";
import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";

export const load = (async ({ params }) => {
  return {
    school: OmniAPI.getSchool(params.school),
  };
}) satisfies PageLoad;
