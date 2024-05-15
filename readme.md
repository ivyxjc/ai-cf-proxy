## Deployment

1. Create One Cloudflare AI Gateway
2. Create One KV
3. Change `env.dev.kv_namespace` config based on the step 2
4. Run `npx wrangler -e prod secret put OPENAI_API_KEY` to add OPENAI_API_KEY to secrets
5. Run `npx wrangler -e prod secret put GEMINI_API_KEY` to add GEMINI_API_KEY to secrets
6. Run `npx wrangler -e prod secret put OPENAI_GATEWAY` to add OPENAI_GATEWAY to secrets

## Register one new secret key to connect Cloudflare worker

1. go to the KV of deployment Step2
2. Create one record with `sk-sample-sk` as key and `username` as value
3. Then you can use `sk-sample-sk` as the secret key to connect Cloudflare worker
