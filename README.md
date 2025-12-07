# 👿 BossFlow ⚔

## Descripción

BossFlow es una aplicación web para diseñar diagramas de flujo interactivos orientados a planificar estrategias contra jefes (bosses) de videojuegos. Cada nodo representa una acción, decisión o efecto, y las conexiones modelan el flujo de la estrategia. Está pensada para jugadores, diseñadores y equipos que quieren documentar tácticas complejas de forma visual.

## Índice

- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Características principales](#características-principales)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Despliegue y demo](#despliegue-y-demo)
- [Documentación adicional](#documentación-adicional)
- [Cómo contribuir](#cómo-contribuir)
- [Contacto](#contacto)
- [Información del equipo](#información-del-equipo)

## Tecnologías utilizadas

BossFlow está construido sobre el stack MERN como base (MongoDB, Express, React, Node). El enfoque MERN ofrece: `MongoDB` para el almacenamiento de datos, `Express` y `Node.js` para la API backend y `React` para la interfaz. Dentro se usan herramientas y librerías que facilitan el desarrollo, el despliegue y la experiencia de usuario.

### MERN (stack principal)

- `MongoDB`: base de datos NoSQL que almacena usuarios, diagramas y metadatos.
- `Express`: framework minimalista para la API REST del backend.
- `React`: biblioteca para construir la interfaz (frontend) y manejar el estado y la navegación.
- `Node.js`: runtime que ejecuta el servidor backend.

### Frontend

- `Vite`: bundler y dev server para React (rápido y moderno).
- `React Flow`: editor de diagramas (lienzo con nodos y conexiones).
- `react-router-dom`: enrutado del frontend.
- `axios`: cliente HTTP para comunicarse con la API.
- `react-icons`: iconos usados en la interfaz.

### Backend

- `mongoose`: ODM para modelar y validar documentos en MongoDB.
- `express`: manejo de rutas, middleware y controladores.
- `jsonwebtoken` / JWT: autenticación basada en tokens.

### DevOps / Infra

- `Docker`: contenedores para aislar frontend y backend.
- `Docker Compose`: orquestación local y despliegue del stack.
- `nginx`: proxy y servidor estático (configuración en `frontend/nginx.conf`).

### Autenticación y seguridad

- `JWT (JSON Web Tokens)`: gestión de sesiones y rutas protegidas.
- Buenas prácticas: variables de entorno para secretos y URIs.

### Tests

- Tests automatizados en `backend/tests` (comprobaciones de endpoints, validaciones y flujos principales).


## Características principales

- Editor visual de diagramas con soporte para nodos personalizados y arrastrar/soltar.
- CRUD completo de diagramas (crear, editar, eliminar, leer).
- Gestión de usuarios y autenticación por JWT (registro/login/protected routes).
- Dashboard completo para moder gestionar los diagramas.
- Exportación de diagramas en formato PNG.
- Exportación / importación de diagramas en JSON.
- Soporte para subir imágenes asociadas a nodos.
- Sistema de plantillas reutilizables.


## Instalación y ejecución

Requisitos previos:

- `Node.js` 18+ y `npm` (solo para desarrollo local).
- `Docker` y `docker-compose` (recomendado para despliegue o para levantar todo el stack fácilmente).

1) Clonar el repositorio

```bash
git clone https://github.com/GunterMagno/BossFlow.git
cd BossFlow
```

2.1 Desarrollo local (sin Docker)

- Backend:

```bash
cd backend
npm install
# configurar variables de entorno (ver sección variables de entorno)
npm run dev
```

- Frontend:

```bash
cd frontend
npm install
npm run dev
```

2.2 Levantar con Docker Compose (modo desarrollo)

```bash
docker compose -f docker-compose.dev.yml up --build
```

2.3 Levantar con Docker Compose (modo desarrollo)

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Variables de entorno (ejemplos)

Backend (archivo `.env` en `backend/`):

```
MONGO_URI=mongodb://mongo:27017/bossflow
JWT_SECRET=tu_secreto_jwt
PORT=4000
```

Frontend (archivo `.env` en `frontend/` o en tu entorno):

```
VITE_API_URL=http://localhost:4000/api
```

## Enlaces al despliegue y a la demo

Enlace al despliegue: [Despliegue de la aplicación](https://bossflow.app/)
    - [Documentación de despliegue](docs/despliegue/).

Enlace a la demo de la aplicación: [Despliegue de la aplicación](https://youtube.com/)

## Documentación adicional

👉 **[Ver índice completo de documentación](docs/README.md)**

La carpeta `docs/` contiene la documentación técnica y de proyecto organizada por áreas:

- `docs/README.md`: índice principal y guía de lectura para navegar la documentación.
- `docs/api/`: especificaciones relacionadas con la estructura de los diagramas. Incluye:
	- `estructura-nodos-json.md`: esquema JSON y reglas de validación para los nodos.
	- `NODE_TYPES.md`: tipos de nodos y su semántica.
- `docs/arquitectura/`: detalles arquitectónicos (diseño de la base de datos, flujo de autenticación, estrategias de logout, etc.). Ej.: `base-de-datos.md`, `auth-flujo.md`.
- `docs/despliegue/`: guías para desplegar la aplicación (VPS, Docker, setup). Ej.: `setup-docker.md`, `DESPLIEGUE.md`, `despliegue-vps.md`.
- `docs/proyecto/`: información del proyecto (objetivos, problema, viabilidad técnica, recursos).
- `docs/historias-usuario/`: historias de usuario y criterios (CRUD de diagramas, flujos de usuario).
- `docs/ui-ux/`: recursos de diseño, notas de Figma y capturas en `docs/ui-ux/capturas/`.


### Documentos Principales del Proyecto
- [Problema.md (Criterio 2a)](docs/proyecto/problema.md)
- [ViabilidadTecnica.md (Criterio 2b)](docs/proyecto/viabilidad-tecnica.md)
- [ObjetivosAlcance.md (Criterio 2d)](docs/proyecto/objetivos-alcance.md)
- [Recursos.md (Criterio 2e)](docs/proyecto/recursos.md)

### Documentación Técnica
- [Estructura JSON de Nodos](docs/api/estructura-nodos-json.md) - JSON Schema, validaciones y ejemplos
- [Tipos de Nodos](docs/api/NODE_TYPES.md) - Tipos personalizados para BossFlow
- [Base de Datos](docs/arquitectura/base-de-datos.md) - Diseño MongoDB
- [Autenticación](docs/arquitectura/auth-flujo.md) - Sistema JWT
- [Despliegue](docs/despliegue/setup-docker.md) - Configuración Docker


## Cómo contribuir

- Crea un fork y abre un Pull Request.
- Sigue las buenas prácticas: prueba correcto funcionamiento, linting y formato.
- Documenta lo realizado.

## Contacto

Para dudas o colaboración abre un Issue o contacta al creador del repositorio.

## Información del equipo

- Alejandro Borrego Cruz
- Jesús López Pérez
- Daniel Montes Iglesias




