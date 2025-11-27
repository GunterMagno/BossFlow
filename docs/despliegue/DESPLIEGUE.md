# 🚀 Quick Start - BossFlow

## Desarrollo Local

```bash
# 1. Iniciar MongoDB
sudo docker start bossflow-mongo

# 2. Iniciar Backend
cd backend
npm start

# 3. Iniciar Frontend
cd frontend
npm run dev

# Acceder: http://localhost:5173
```

## Producción VPS

```bash
# 1. Clonar repo
git clone https://github.com/GunterMagno/BossFlow.git
cd BossFlow

# 2. Editar JWT_SECRET en docker-compose.yml

# 3. Levantar todo
sudo docker compose up -d

# 4. Verificar
sudo docker compose ps
curl http://localhost/api/health

# Acceder: http://tu-ip-vps
```

## Comandos Esenciales

```bash
# Ver logs
sudo docker compose logs -f

# Reiniciar todo
sudo docker compose restart

# Detener todo
sudo docker compose down

# Actualizar código
git pull && sudo docker compose up -d --build
```

---

Ver documentación completa en `docs/despliegue-vps.md`
