.PHONY: db-up
db-up: ## Run svelte-check for type errors
	pnpm docker-compose up -d 

.PHONY: db-down
db-down: ## Run svelte-check for type errors
	pnpm docker-compose down -v

.PHONY: db-studio
db-studio: ## Run svelte-check for type errors
	pnpm run db:studio

