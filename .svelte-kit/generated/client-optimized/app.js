export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15')
];

export const server_loads = [0];

export const dictionary = {
		"/": [2],
		"/about": [3],
		"/auth/error": [4],
		"/auth/signin": [~5],
		"/auth/signup": [~6],
		"/contact": [7],
		"/novinky": [8],
		"/profile": [~9],
		"/schedule": [~10],
		"/subjects/[link]": [~11],
		"/subjects/[link]/tabs": [~12],
		"/subjects/[link]/tabs/subtabs": [~13],
		"/subjects/[link]/tabs/subtabs/content": [~14],
		"/tester": [~15]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';