import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";

export async function load({ fetch }) {
    return {
        riders: await OmniAPI.getRiders(fetch)
    };
}