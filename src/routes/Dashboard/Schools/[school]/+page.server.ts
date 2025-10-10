import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";
import { NotFoundError } from "$lib/ts/OmniAPI/APIErrors";
import { error } from "@sveltejs/kit";

export async function load({ params, fetch }) {
    try {
        return {
            school: await OmniAPI.getSchool(params.school, fetch),
        };
    } catch (e) {
        if (!(e instanceof NotFoundError)) throw e;

        error(404, `School ${params.school} does not exist.`);
    }
}