# ---------------- General ----------------
up:
	docker compose up -d --build           # levantar todos los servicios en segundo plano

down:
	docker compose down                    # detener todos los servicios

restart: down up                           # reiniciar todos los servicios

# ---------------- Database / Seed ----------------
seed:
	docker compose exec backend npm run seed   # correr seed de backend dentro del contenedor

# ---------------- Backend ----------------
backend-dev:
	docker compose exec backend npm run dev    # levantar backend en desarrollo (hot reload)

backend-start:
	docker compose exec backend npm run start  # levantar backend en producción

backend lint:
	docker-compose exec backend npm run lint   # lint backend

backend test:
	docker-compose exec backend npm run test   # test backend

# ---------------- Frontend ----------------
frontend dev:
	docker-compose exec frontend npm run dev       # levantar frontend en desarrollo (hot reload)

frontend build:
	docker-compose exec frontend npm run build     # build frontend producción

frontend preview:
	docker-compose exec frontend npm run preview   # preview del build

frontend lint:
	docker-compose exec frontend npm run lint      # lint frontend

# ---------------- Dev Full Stack ----------------
dev:
	make up
	docker compose exec backend npm run dev & \
	docker compose exec frontend npm run dev

prod:
	make up
	docker compose exec backend npm run start & \
	docker compose exec frontend npm run build
