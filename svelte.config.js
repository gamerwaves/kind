import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Use a fallback for static hosts that don't support SPA routing
			fallback: '404.html'
		}),
		paths: {
			// Use an empty base path in development and a specified base path in production
			base: process.env.NODE_ENV === 'development' ? '' : process.env.BASE_PATH || '/kind'
		},
		prerender: {
			// Suppress errors for unreachable routes during prerendering
			handleHttpError: 'warn'
		}
	}
};

export default config;
