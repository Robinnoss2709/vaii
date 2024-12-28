import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DF0ZM5Ww.js","_app/immutable/chunks/0.C9r3skyW.js","_app/immutable/chunks/14.86e8shJ1.js","_app/immutable/chunks/disclose-version.CdZuIc7i.js","_app/immutable/chunks/runtime.DFuotMX-.js","_app/immutable/chunks/index-client.D03nj6NQ.js","_app/immutable/chunks/legacy.CsAF3hgt.js","_app/immutable/chunks/render.DdyBg62a.js","_app/immutable/chunks/shared.bwbMXRKO.js","_app/immutable/chunks/lifecycle.DL_zfByv.js","_app/immutable/chunks/store.daZB09SA.js","_app/immutable/chunks/each.DwzIx-JD.js","_app/immutable/chunks/attributes.BFnUm24A.js","_app/immutable/chunks/props.7yD5DXMa.js","_app/immutable/chunks/proxy.DSCVJwOG.js","_app/immutable/chunks/client.CNhSmv7W.js","_app/immutable/chunks/entry.DVvn58Tu.js","_app/immutable/chunks/index.BTgz_x7K.js"];
export const stylesheets = ["_app/immutable/assets/0.BbJZba9L.css"];
export const fonts = [];
