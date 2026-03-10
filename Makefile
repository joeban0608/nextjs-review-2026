# 預設環境
ENV ?= local

# 根據 ENV 變數決定使用的 .env 檔案
ifeq ($(ENV), prod)
    ENV_FILE := .env.production
else
    ENV_FILE := .env
endif

# 讀取環境變數 (選用，若要在 Makefile 內使用變數)
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif

.PHONY: help
help: ## 顯示指令說明
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: up
up: ## 啟動 Local Docker
	docker-compose --env-file .env up -d

.PHONY: down
down: ## 停止 Local Docker
	docker-compose down -v

.PHONY: db-push
db-push: ## 推送 Schema (使用範例: make db-push ENV=prod)
	@echo "Targeting environment: $(ENV) using $(ENV_FILE)"
	pnpm dlx dotenv-cli -e $(ENV_FILE) -- npx drizzle-kit push

.PHONY: db-studio
db-studio: ## 開啟 Drizzle Studio (使用範例: make db-studio ENV=prod)
	@echo "Opening Studio for $(ENV)..."
	pnpm dlx dotenv-cli -e $(ENV_FILE) -- npx drizzle-kit studio

.PHONY: db-generate
db-generate: ## 產生 Migration 檔案
	npx drizzle-kit generate