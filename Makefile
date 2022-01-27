cache:
	deno cache main.ts

dev: cache
	deno run --allow-net --allow-env --allow-read --watch="./**/*.ts" main.ts

serve: cache
	deno run --allow-net --allow-env --allow-read main.ts

docker:
	DOCKER_BUILDKIT=0 docker build -t ball6847/ansible-semaphore-webhook:latest .
