export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const headers = new Headers(request.headers);
		const authKey = 'Authorization';
		const headerKey = headers.get(authKey)?.split(' ').pop();

		const searchParams = new URL(request.url).searchParams;
		const paramKey = searchParams.get('key');

		const token =  headerKey||paramKey;
		if (!token) throw 'Auth required';

		// validate user
		const user = await env.KV.get(token, { type: 'text' }) || '';
		if (!user) {
			return new Response('Invalid gemini token', { status: 401 });
		}

		const newHeaders = new Headers(request.headers);
		newHeaders.delete('Authorization');

		let pathname = new URL(request.url).pathname;
		// ChatGptNextWeb add /api/google to the path
		if (pathname.startsWith('/api/google')) {
			pathname = pathname.substring(11);
		}
		console.log(pathname);
		console.log(env.GEMINI_GATEWAY + pathname + '?key=' + env.GEMINI_API_KEY);

		const newRequest = new Request(env.GEMINI_GATEWAY + pathname + '?key=' + env.GEMINI_API_KEY, {
			method: request.method,
			headers: newHeaders,
			body: request.body
		});
		return await fetch(newRequest);
	}
};
