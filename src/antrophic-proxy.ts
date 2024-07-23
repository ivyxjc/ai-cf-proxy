export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const headers = new Headers(request.headers);
		const authKey = 'x-api-key';
		const headerKey = headers.get(authKey)?.split(' ').pop();

		const searchParams = new URL(request.url).searchParams;
		const paramKey = searchParams.get('key');

		const token = headerKey || paramKey;
		if (!token) throw 'Auth required';

		// validate user
		const user = await env.KV.get(token, { type: 'text' }) || '';
		if (!user) {
			return new Response('Invalid anthropic token', { status: 401 });
		}

		const newHeaders = new Headers(request.headers);
		newHeaders.delete('x-api-key');
		newHeaders.append('x-api-key', env.ANTHROPIC_API_KEY);

		let pathname = new URL(request.url).pathname;
		if (pathname.startsWith('/anthropic')) {
			pathname = pathname.substring(10);
		}

		const newRequest = new Request(env.ANTHROPIC_GATEWAY + pathname, {
			method: request.method,
			headers: newHeaders,
			body: request.body
		});
		return await fetch(newRequest);
	}
};
