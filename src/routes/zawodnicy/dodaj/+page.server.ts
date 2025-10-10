import OmniAPI from '$lib/ts/OmniAPI/OmniAPI';

export async function load({ fetch }) {
    return { schools: await OmniAPI.getSchools(fetch) };
}