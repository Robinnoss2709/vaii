import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { Config } from '@sveltejs/kit';

/** @type {Config} */
const config: Config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
	},
};

export default config;
