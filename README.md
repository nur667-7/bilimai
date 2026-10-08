# BilimAI
A newly built, private pilot MVP for adults reviewing foundational mathematics in Russian, Kazakh and Uzbek. Created 8 October 2026. It does not derive from the missing original ZIP.

## Included
- Three curated lessons and nine questions per language, deterministic scoring, error explanations and retry.
- Mobile layout, accessible controls, reduced-motion support, actual language tags.
- Direct server-side Claude Messages integration, strict input/output validation and plain text rendering.
- Sites-owned ChatGPT sign-in and explicit pilot user allowlist.
- Same-origin protection; consent and 18+ acknowledgement; maximum body 4 KiB, question 600 characters, output 800 tokens, 20 second provider timeout; no automatic paid retries.
- Atomic D1 reservations: 2 calls/user/minute, 10/user/day, 50 globally/day, 500 total pilot calls. Failures count. UTC resets. Deleting reservations resets the lifetime cap: require an explicit new budget before doing so.
- No prompt/response storage, analytics, payments or document uploads.
- Read-only WebMCP get_current_lesson tool when supported. Actual native WebMCP validation unavailable in the local browser.

## Run
Node 24 recommended (tests use native TypeScript and node:sqlite).
npm ci
npm run dev
npm run typecheck
npm test
npm run build

The starter's Windows plugin package-manager wrapper failed on this host. Successful local alternatives used:
node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install --no-audit --no-fund
node node_modules/typescript/bin/tsc --noEmit
node --test tests/core.test.mjs
node scripts/run-framework.mjs build

## Runtime activation
Configure the keys in .env.example through Sites. ANTHROPIC_API_KEY and QUOTA_HASH_SECRET must be secrets. No real Anthropic key has been obtained or configured. PILOT_ALLOWED_USER_IDS is initially empty: AI requests are denied. Provision actual user IDs after sign-in; never use the local mock identity in production. Configure provider spend limits before enabling live traffic. Redeploy after changing runtime values.

APP_ORIGIN must exactly match the chosen hosted origin. A custom domain requires updating this value and redeploying. Only use identity headers behind Sites dispatch; direct public Worker exposure would invalidate this trust assumption. Do not repurpose this authentication for another host.

.env.example provides the officially listed claude-haiku-5-5 model ID as of 8 October 2026. Confirm access using the Models API and perform live quality evals before activation. Provider behavior has been mocked in tests; real Claude calls are NOT verified.

## Database
drizzle/0000_silly_colonel_america.sql is the schema-only migration. Production Sites applies migrations on publish. Local development mock DB has no production data. Never edit an applied migration. Rate records contain hashed user ID, day/minute and request ID; configure a retention policy before a public launch without accidentally resetting budget controls.

## Pilot boundaries
No educational effectiveness or product demand has been measured. The Kazakh and Uzbek content needs native-speaker and educator review before recruitment. Account sign-in does not independently verify age. The UI's 18+ acknowledgement is only a self-declaration. The privacy page describes a closed prototype; a real service operator, contact and retention schedule remain prerequisites for public launch.

## Verification
Seven core checks passed: inputs/consent, bounded Claude request, provider error hygiene, malformed/truncated output, minute/day quotas, global/lifetime quotas, language alignment/arithmetic. Type checking and production build passed. Browser verified 3/3 and 0/3 scores, retry, Kazakh language switch and 390px mobile width. See the delivery report for final API smoke test and deployment status.

