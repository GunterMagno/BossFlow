# Setup entorno de desarrollo (Docker) — BossFlow

## Utilizado
- Docker (daemon activo) y Docker Compose V2 (`docker compose`)
- Make

## Archivos clave
- `docker-compose.yml` (raíz)
- `frontend/Dockerfile`, `frontend/.dockerignore`
- `backend/Dockerfile`, `backend/.dockerignore`
- `.env.example` (raíz)
- `Makefile` (atajos: `make up`, `make down`, ...)

## .env (ejemplo)
Crea un `.env` local a partir de `.env.example`.

## Para levantar docker utiliza Makefile (atajos)
- `make up` → `docker compose up -d --build`
- `make down` → `docker compose down`
- `make backend-dev` → `docker compose exec backend npm run dev`
- `make frontend-build` → `docker compose exec frontend npm run build`


## NOTAS

- En caso de tener definidos los `.env`, modificar los Dockerfile con las variable de entorno creadas anteriormente.

