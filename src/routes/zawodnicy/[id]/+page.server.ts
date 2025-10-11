import { NotFoundError } from '$lib/ts/OmniAPI/APIErrors.js';
import OmniAPI from '$lib/ts/OmniAPI/OmniAPI';
import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
    try {
        return { 
        rider: await OmniAPI.getRider(params.id, fetch),
        schools: await OmniAPI.getSchools(fetch)
    };
    } catch (e) {
        if (!(e instanceof NotFoundError)) throw e;

        error(404, `School ${params.id} does not exist.`);
    }
}