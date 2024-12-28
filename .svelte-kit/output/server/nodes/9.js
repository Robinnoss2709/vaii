import * as server from '../entries/pages/profile/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/profile/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.CuOXNpj9.js","_app/immutable/chunks/disclose-version.CdZuIc7i.js","_app/immutable/chunks/runtime.DFuotMX-.js","_app/immutable/chunks/legacy.CsAF3hgt.js"];
export const stylesheets = [];
export const fonts = [];
