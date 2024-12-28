export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["assets/particles.json","favicon.png","images/leftLogo.jpg","images/leftLogo.png","images/logo.png","images/rightLogo.jpg","images/rightLogo.png","images/verticalLogo.jpg","images/verticalLogo.png"]),
	mimeTypes: {".json":"application/json",".png":"image/png",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.B_ahsJAR.js","app":"_app/immutable/entry/app.DoWeW0jL.js","imports":["_app/immutable/entry/start.B_ahsJAR.js","_app/immutable/chunks/entry.DVvn58Tu.js","_app/immutable/chunks/runtime.DFuotMX-.js","_app/immutable/chunks/index.BTgz_x7K.js","_app/immutable/chunks/index-client.D03nj6NQ.js","_app/immutable/entry/app.DoWeW0jL.js","_app/immutable/chunks/14.86e8shJ1.js","_app/immutable/chunks/runtime.DFuotMX-.js","_app/immutable/chunks/render.DdyBg62a.js","_app/immutable/chunks/shared.bwbMXRKO.js","_app/immutable/chunks/disclose-version.CdZuIc7i.js","_app/immutable/chunks/store.daZB09SA.js","_app/immutable/chunks/proxy.DSCVJwOG.js","_app/immutable/chunks/this.D0XcZ4YC.js","_app/immutable/chunks/props.7yD5DXMa.js","_app/immutable/chunks/index-client.D03nj6NQ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/auth/confirm",
				pattern: /^\/auth\/confirm\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/auth/confirm/_server.ts.js'))
			},
			{
				id: "/auth/error",
				pattern: /^\/auth\/error\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/auth/logout",
				pattern: /^\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/auth/logout/_server.ts.js'))
			},
			{
				id: "/auth/signin",
				pattern: /^\/auth\/signin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/auth/signup",
				pattern: /^\/auth\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/novinky",
				pattern: /^\/novinky\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: __memo(() => import('./entries/endpoints/profile/_server.ts.js'))
			},
			{
				id: "/schedule",
				pattern: /^\/schedule\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: __memo(() => import('./entries/endpoints/schedule/_server.ts.js'))
			},
			{
				id: "/schedule/[id]",
				pattern: /^\/schedule\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/schedule/_id_/_server.ts.js'))
			},
			{
				id: "/subjects/[link]",
				pattern: /^\/subjects\/([^/]+?)\/?$/,
				params: [{"name":"link","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/subjects/[link]/tabs",
				pattern: /^\/subjects\/([^/]+?)\/tabs\/?$/,
				params: [{"name":"link","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: __memo(() => import('./entries/endpoints/subjects/_link_/tabs/_server.ts.js'))
			},
			{
				id: "/subjects/[link]/tabs/subtabs",
				pattern: /^\/subjects\/([^/]+?)\/tabs\/subtabs\/?$/,
				params: [{"name":"link","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: __memo(() => import('./entries/endpoints/subjects/_link_/tabs/subtabs/_server.ts.js'))
			},
			{
				id: "/subjects/[link]/tabs/subtabs/content",
				pattern: /^\/subjects\/([^/]+?)\/tabs\/subtabs\/content\/?$/,
				params: [{"name":"link","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: __memo(() => import('./entries/endpoints/subjects/_link_/tabs/subtabs/content/_server.ts.js'))
			},
			{
				id: "/tester",
				pattern: /^\/tester\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: __memo(() => import('./entries/endpoints/tester/_server.ts.js'))
			},
			{
				id: "/tester/[id]",
				pattern: /^\/tester\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/tester/_id_/_server.ts.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
