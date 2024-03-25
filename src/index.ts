/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import handleOpenAI from './openai-proxy';
import handleGemini from './gemini-proxy';

import handlePreflight from './preflight';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (request.method.toLowerCase() === 'options') {
			return handlePreflight.fetch(request, env, ctx);
		}
		if (url.pathname.includes('gemini')) {
			return handleGemini.fetch(request, env, ctx);
		}
		return handleOpenAI.fetch(request, env, ctx);
	}
};
