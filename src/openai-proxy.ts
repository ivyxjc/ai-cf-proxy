export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const headers = new Headers(request.headers);
		const authKey = 'Authorization';
		const token = headers.get(authKey)?.split(' ').pop();
		if (!token) throw 'Auth required';

		// validate user
		const user = await env.KV.get(token, { type: 'text' }) || '';
		if (!user) {
			return new Response('Invalid openai token', { status: 401 });
		}
		const newHeaders = new Headers(request.headers);
		newHeaders.set('Authorization', `Bearer ${env.OPENAI_API_KEY}`);

		let pathname = new URL(request.url).pathname;
		if (pathname.startsWith('/v1')) {
			// some sdk will put /v1 at the begin, some will not
			pathname = pathname.substring(3);
		}
		const newRequest = new Request(env.OPENAI_GATEWAY + pathname, {
			method: request.method,
			headers: newHeaders,
			body: request.body
		});

		return await fetch(newRequest);
	}
};
