import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";

export async function load({ fetch }) {
    return {
        gokarts: await OmniAPI.getGokarts(fetch)
    };
}