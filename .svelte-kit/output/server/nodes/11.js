import * as server from '../entries/pages/subjects/_link_/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/subjects/_link_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/subjects/[link]/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.BSbIiHjZ.js","_app/immutable/chunks/disclose-version.CdZuIc7i.js","_app/immutable/chunks/runtime.DFuotMX-.js","_app/immutable/chunks/legacy.CsAF3hgt.js","_app/immutable/chunks/store.daZB09SA.js","_app/immutable/chunks/lifecycle.DL_zfByv.js","_app/immutable/chunks/props.7yD5DXMa.js","_app/immutable/chunks/proxy.DSCVJwOG.js","_app/immutable/chunks/index.DZYfpQbg.js","_app/immutable/chunks/client.CNhSmv7W.js","_app/immutable/chunks/entry.DVvn58Tu.js","_app/immutable/chunks/index.BTgz_x7K.js","_app/immutable/chunks/index-client.D03nj6NQ.js","_app/immutable/chunks/render.DdyBg62a.js","_app/immutable/chunks/shared.bwbMXRKO.js","_app/immutable/chunks/each.DwzIx-JD.js","_app/immutable/chunks/attributes.BFnUm24A.js","_app/immutable/chunks/class.BVZzqmLw.js","_app/immutable/chunks/input.BWrmKwv7.js","_app/immutable/chunks/select.hP7sz2eA.js","_app/immutable/chunks/this.D0XcZ4YC.js"];
export const stylesheets = ["_app/immutable/assets/11.B5R44thI.css"];
export const fonts = [];
