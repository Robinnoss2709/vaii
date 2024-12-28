

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.dpfDfs9A.js","_app/immutable/chunks/disclose-version.CdZuIc7i.js","_app/immutable/chunks/runtime.DFuotMX-.js","_app/immutable/chunks/legacy.CsAF3hgt.js"];
export const stylesheets = [];
export const fonts = [];
