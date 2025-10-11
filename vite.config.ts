import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({mode}) => {
	const env = {...process.env, ...loadEnv(mode, process.cwd())};
	return {
		plugins: [sveltekit()],
		define: {
			__DEBUG: env['NODE_ENV'] === 'development',
			__NO_CONTROLLER: env['NO_CONTROLLER'] === '1'
		}
	}
});
