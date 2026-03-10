# 🗄️ Database Management Guide

本專案使用 **Drizzle ORM** 搭配 **PostgreSQL**，並透過 `Makefile` 簡化不同環境（本地 Docker 與 遠端 Supabase）的操作流程。

---

## 📍 環境變數設定 (Environment Variables)

在執行任何指令前，請確保專案根目錄具備以下檔案，並包含正確的 `DATABASE_URL`：

* `.env`: 用於 **Local** 開發（預設連向本地 Docker 容器）。
* `.env.production`: 用於 **Production** 環境（連向 Supabase 遠端資料庫）。

---

## 🚀 快速指令表 (Quick Reference)

使用 `make <指令> ENV=prod` 即可切換至生產環境，預設不加參數則為 `local`。

| 功能描述 | 本地指令 (Local) | 生產環境指令 (Supabase) |
| :--- | :--- | :--- |
| **啟動 Docker DB** | `make up` | -- |
| **停止 Docker DB** | `make down` | -- |
| **同步 Schema** | `make db-push` | `make db-push ENV=prod` |
| **開啟 GUI 介面** | `make db-studio` | `make db-studio ENV=prod` |
| **產生 Migration** | `make db-generate` | `make db-generate` |

---

## 📖 詳細操作流程

### 1. 本地開發環境 (Local Development)
如果你要在本地啟動乾淨的資料庫並套用 Schema：
```bash
# 啟動 Docker 容器中的 PostgreSQL
make up

# 將 schema.ts 的結構同步到本地資料庫
make db-push

# 開啟 Drizzle Studio 查看本地資料
make db-studio