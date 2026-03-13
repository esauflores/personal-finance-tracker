set dotenv-load := true

_default:
  @just --list

setup-hooks:
  cp .hooks/pre-commit .git/hooks/pre-commit
  chmod +x .git/hooks/pre-commit

setup:
  pnpm install
  @just setup-hooks

check:
  pnpm lint && pnpm test

