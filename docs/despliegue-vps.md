# 🚀 Guía de Despliegue - BossFlow

## 📋 Arquitectura de la Aplicación

```
┌─────────────────────────────────────────────────┐
│              VPS (Puerto 80)                    │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         Nginx (Frontend Container)       │  │
│  │         Puerto: 80                       │  │
│  │                                          │  │
│  │  • Sirve React App estático              │  │
│  │  • Proxy /api → backend:5000             │  │
│  └────────────┬─────────────────────────────┘  │
│               │                                 │
│               ▼                                 │
│  ┌──────────────────────────────────────────┐  │
│  │      Backend (Node.js Container)         │  │
│  │      Puerto interno: 5000                │  │
│  │                                          │  │
│  │  • API REST Express                      │  │
│  │  • Autenticación JWT                     │  │
│  └────────────┬─────────────────────────────┘  │
│               │                                 │
│               ▼                                 │
│  ┌──────────────────────────────────────────┐  │
│  │      MongoDB (Container)                 │  │
│  │      Puerto interno: 27017               │  │
│  │                                          │  │
│  │  • Base de datos                         │  │
│  │  • Volumen persistente                   │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Red Docker: app-network                       │
└─────────────────────────────────────────────────┘
```

---

## 🔌 Puertos y URLs

### **Desarrollo Local**
| Servicio  | Puerto | URL                          |
|-----------|--------|------------------------------|
| Frontend  | 5173   | http://localhost:5173        |
| Backend   | 5000   | http://localhost:5000/api    |
| MongoDB   | 27017  | mongodb://localhost:27017    |

### **Producción (Docker/VPS)**
| Servicio  | Puerto Externo | Puerto Interno | URL                     |
|-----------|----------------|----------------|-------------------------|
| Nginx     | 80             | 80             | http://tu-dominio.com   |
| Backend   | -              | 5000           | (interno via proxy)     |
| MongoDB   | -              | 27017          | (interno via red Docker)|

> **Nota:** En producción, solo el puerto 80 (Nginx) está expuesto. Backend y MongoDB están en red interna de Docker.

---

## 🛠️ Configuración de Red Docker

### **Red Interna**
```yaml
networks:
  app-network:
    driver: bridge
```

**Servicios conectados:**
- `frontend` → Puede comunicarse con `backend` usando `http://backend:5000`
- `backend` → Puede comunicarse con `mongo` usando `mongodb://mongo:27017`

### **Volúmenes Persistentes**
```yaml
volumes:
  mongo-data:
```
- Almacena los datos de MongoDB
- Persiste aunque se eliminen los contenedores

---

## 📝 Variables de Entorno

### **Desarrollo Local (`.env`)**
```bash
# Backend
BACKEND_PORT=5000
MONGO_URI=mongodb://localhost:27017/bossflow
JWT_SECRET=tu_clave_secreta
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:5000
```

### **Producción (docker-compose.yml)**
```yaml
backend:
  environment:
    NODE_ENV: production
    BACKEND_PORT: 5000
    MONGO_URI: mongodb://mongo:27017/bossflow
    JWT_SECRET: CAMBIAR_EN_PRODUCCION

frontend:
  build:
    args:
      VITE_API_URL: /api  # Usa proxy reverso de Nginx
```

---

## 🚀 Despliegue en VPS

### **1. Requisitos Previos**
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose-plugin

# Verificar instalación
docker --version
docker compose version
```

### **2. Clonar Repositorio**
```bash
git clone https://github.com/GunterMagno/BossFlow.git
cd BossFlow
```

### **3. Configurar Producción**
```bash
# Editar JWT_SECRET en docker-compose.yml
nano docker-compose.yml

# Cambiar:
JWT_SECRET: "TU_CLAVE_SUPER_SEGURA_AQUI"
```

### **4. Construir y Levantar Servicios**
```bash
# Construir imágenes
sudo docker compose build

# Levantar servicios en segundo plano
sudo docker compose up -d

# Ver logs
sudo docker compose logs -f
```

### **5. Verificar Estado**
```bash
# Ver contenedores corriendo
sudo docker compose ps

# Probar la aplicación
curl http://localhost/api/health
```

### **6. Configurar Dominio (Opcional)**
```bash
# Editar nginx.conf si tienes dominio
nano frontend/nginx.conf

# Cambiar:
server_name tu-dominio.com;

# Reconstruir
sudo docker compose up -d --build frontend
```

---

## 🔧 Comandos Útiles

### **Gestión de Servicios**
```bash
# Iniciar servicios
sudo docker compose up -d

# Detener servicios
sudo docker compose down

# Reiniciar un servicio específico
sudo docker compose restart backend

# Ver logs en tiempo real
sudo docker compose logs -f backend

# Ver logs de todos los servicios
sudo docker compose logs -f
```

### **Mantenimiento**
```bash
# Eliminar todo (incluyendo volúmenes)
sudo docker compose down -v

# Reconstruir sin cache
sudo docker compose build --no-cache

# Actualizar código y reiniciar
git pull
sudo docker compose up -d --build
```

### **Base de Datos**
```bash
# Acceder a MongoDB
sudo docker compose exec mongo mongosh bossflow

# Backup de la BD
sudo docker compose exec mongo mongodump --out=/data/backup

# Restaurar BD
sudo docker compose exec mongo mongorestore /data/backup
```

---

## 🔒 Seguridad en Producción

### **1. Cambiar JWT_SECRET**
```yaml
# En docker-compose.yml
JWT_SECRET: "genera_un_string_aleatorio_de_64_caracteres"
```

### **2. Configurar Firewall**
```bash
# Permitir solo puerto 80 y SSH
sudo ufw allow 22
sudo ufw allow 80
sudo ufw enable
```

### **3. HTTPS con Let's Encrypt (Recomendado)**
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Auto-renovación
sudo certbot renew --dry-run
```

---

## 📊 Monitoreo

### **Ver Estado de Servicios**
```bash
# CPU, Memoria, Red
sudo docker stats

# Espacio en disco
sudo docker system df
```

### **Health Checks**
```bash
# Backend
curl http://localhost/api/health

# Frontend
curl http://localhost
```

---

## 🐛 Resolución de Problemas

### **El frontend no carga**
```bash
# Ver logs del frontend
sudo docker compose logs frontend

# Reconstruir frontend
sudo docker compose up -d --build frontend
```

### **Backend no conecta a MongoDB**
```bash
# Verificar que mongo está corriendo
sudo docker compose ps mongo

# Ver logs de mongo
sudo docker compose logs mongo

# Reiniciar mongo
sudo docker compose restart mongo
```

### **Error de CORS**
```bash
# Verificar que el frontend use /api
# En frontend/src/services/api.js debe ser:
baseURL: '/api'  // No http://localhost:5000
```

---

## 📁 Estructura de Archivos Importantes

```
BossFlow/
├── docker-compose.yml       # Orquestación de servicios
├── .env                     # Variables desarrollo local
├── .env.production          # Variables producción (ejemplo)
├── backend/
│   ├── Dockerfile          # Imagen backend
│   └── server.js           # Servidor Express
├── frontend/
│   ├── Dockerfile          # Imagen frontend
│   ├── nginx.conf          # Configuración Nginx + Proxy
│   └── vite.config.js      # Build configuration
└── docs/
    └── despliegue-vps.md   # Este documento
```

---

## ✅ Checklist Pre-Despliegue

- [ ] JWT_SECRET cambiado en docker-compose.yml
- [ ] Dominio configurado (si aplica)
- [ ] Docker y Docker Compose instalados
- [ ] Firewall configurado
- [ ] Backup de datos existente (si hay)
- [ ] Variables de entorno verificadas
- [ ] Nginx configurado correctamente

---

## 🎯 Próximos Pasos (Opcional)

1. **SSL/HTTPS:** Configurar certificados Let's Encrypt
2. **CI/CD:** Automatizar despliegue con GitHub Actions
3. **Monitoring:** Instalar Prometheus + Grafana
4. **Backups:** Automatizar backups de MongoDB
5. **Load Balancer:** Si hay mucho tráfico

---

**Documentación creada:** 19 de Noviembre, 2025  
**Autor:** Alejandro Borrego Cruz (@GunterMagno)  
**Versión:** 1.0
