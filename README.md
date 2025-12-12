# 👿 BossFlow ⚔

![Logo](./frontend/public/logo.png)

## Descripción

BossFlow es una aplicación web que permite a los jugadores crear, compartir y gestionar diagramas de flujo interactivos con estrategias para derrotar jefes finales (bosses) en videojuegos. La plataforma facilita la colaboración entre gamers, permitiendo documentar de forma visual y estructurada las mecánicas, patrones de ataque, fases de combate y estrategias óptimas para superar los desafíos más difíciles de sus juegos favoritos.

La aplicación combina un editor de diagramas intuitivo con funcionalidades sociales, permitiendo a los usuarios registrarse, crear diagramas personalizados con diferentes tipos de nodos (información, acción, decisión, fase), gestionar sus estrategias y compartirlas con la comunidad. Los usuarios pueden exportar sus diagramas en formato JSON o como imágenes, facilitando el intercambio de conocimiento y la mejora colaborativa de estrategias.

BossFlow resuelve el problema de la fragmentación de información sobre estrategias de videojuegos, ofreciendo una herramienta centralizada y visual que sustituye las guías de texto estático por diagramas interactivos y fáciles de seguir durante las partidas. Ideal para comunidades de jugadores que buscan optimizar su rendimiento y compartir tácticas efectivas de forma clara y accesible.

## Índice

- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Características principales](#características-principales)
- [Enlace a la aplicación desplegada](#enlace-a-la-aplicación-desplegada)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Despliegue y demo](#enlaces-despliegue-y-demo)
- [Cómo contribuir](#cómo-contribuir)
- [Contacto](#contacto)
- [Información del equipo](#información-del-equipo)
- [Documentación adicional](#documentación-adicional)

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

## Enlace a la aplicación desplegada

[https://bossflow.app/](https://bossflow.app/)

## Capturas de pantalla

1. Al acceder a la aplicación (home y banner):

![Imagen 1](./docs/img-app/img1.png)

2. Pantalla de registro:

![Imagen 2](./docs/img-app/img2.png)

3. Polica de privacidad (vista a página políticas):

![Imagen 3](./docs/img-app/img3.png)

4. Modal para crear diagrama:

![Imagen 4](./docs/img-app/img4.png)

5. Editor:

![Imagen 5](./docs/img-app/img5.png)

6. Modal de exportación de diagramas:

![Imagen 6](./docs/img-app/img6.png.png)

7. Modal de importación de diagramas:

![Imagen 7](./docs/img-app/img7.png)

8. Vista Dashboard: 

![Imagen 8](./docs/img-app/img10.png)

9. Perfil de usuario:

![Imagen 0](./docs/img-app/img8.png)

10. Modal eliminación de cuenta:

![Imagen 10](./docs/img-app/img9.png) 


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

## Enlaces despliegue y demo

Enlace al despliegue: [Despliegue de la aplicación](https://bossflow.app/)
    - [Documentación de despliegue](docs/despliegue/).

Enlace a la demo de la aplicación: [Despliegue de la aplicación](https://youtube.com/)


## Cómo contribuir

- Crea un fork y abre un Pull Request.
- Sigue las buenas prácticas: prueba correcto funcionamiento, linting y formato.
- Documenta lo realizado.

## Contacto

Para dudas o colaboración abre un Issue o contacta al creador del repositorio.

## Información del equipo

### Documentación profesores
> [!NOTE]
> Esta documentación va dirigida a algunos profesores en específico por los requerimentos de su asignatura.

#### Daniel Sánchez Benítez
- **[Propuesta inicial](docs/dani/propuesta-inicial.pdf)**
- **[Requisitos técnicos](docs/dani/requisitos-tecnicos.pdf)**
- **[Evaluación técnica](docs/dani/evaluacion-tecnica.pdf)**

## Información del equipo  
- Alejandro Borrego Cruz - [Perfil Github](https://github.com/GunterMagno)
- Jesús López Pérez - [Perfil Github](https://github.com/jesuuslopeez)
- Daniel Montes Iglesias - [Perfil Github](https://github.com/danielmi5)

## Documentación adicional

La documentación adicional se encuentra en [./docs](./docs).

Enlace a la [WIKI](https://github.com/GunterMagno/BossFlow/wiki)

👉 **[Ver índice completo de documentación](docs/README.md)**

La carpeta `docs/` contiene la documentación técnica y de proyecto organizada por áreas:

### Estructura de la documentación

#### Documentos Raíz
- `docs/README.md`: índice principal y guía de lectura para navegar la documentación
- `docs/analisis-competencia.md`: análisis de aplicaciones similares y competencia
- `docs/estructura-organizativa.md`: organización del equipo y roles
- `docs/recursos.md`: recursos materiales, herramientas y servicios utilizados
- `docs/financiacion.md`: plan de financiación y costes del proyecto
- `docs/presupuesto.md`: desglose detallado del presupuesto
- `docs/legislacion.md`: marco legal y normativa aplicable
- `docs/documentacion-legislacion.md`: documentación legal detallada
- `docs/retrospectiva.md`: retrospectivas de sprints y lecciones aprendidas

#### API (`docs/api/`)
Especificaciones relacionadas con la estructura de los diagramas:
- `estructura-nodos-json.md`: esquema JSON y reglas de validación para los nodos
- `NODE_TYPES.md`: tipos de nodos y su semántica

#### Arquitectura (`docs/arquitectura/`)
Detalles arquitectónicos del sistema:
- `arquitectura-tecnica.md`: diseño general de la arquitectura
- `base-de-datos.md`: esquema y modelo de datos MongoDB
- `auth-flujo.md`: flujo de autenticación y autorización JWT
- `estrategia-logout.md`: implementación del cierre de sesión

#### Despliegue (`docs/despliegue/`)
Guías para desplegar la aplicación:
- `DESPLIEGUE.md`: guía rápida de despliegue
- `despliegue-vps.md`: despliegue en VPS con Docker
- `setup-docker.md`: configuración de Docker y Docker Compose

#### Proyecto (`docs/proyecto/`)
Información del proyecto y planificación:
- `objetivos-alcance.md`: objetivos y alcance del proyecto
- `problema.md`: definición del problema a resolver
- `viabilidad-tecnica.md`: análisis de viabilidad técnica
- `asignacion.md`: asignación de tareas y responsabilidades
- `recursos.md`: recursos del proyecto (duplicado, ver raíz)

#### Historias de Usuario (`docs/historias-usuario/`)
Historias de usuario y criterios de aceptación:
- `crud-diagramas.md`: historias de usuario para el CRUD de diagramas

#### Sprints (`docs/sprints/`)
Planificación y seguimiento de sprints:
- `planificacion-sprints.md`: planificación general de sprints
- `product-backlog.md`: backlog de producto
- `sprint1/`, `sprint2/`, `sprint3/`...: ceremonias y documentación de cada sprint

#### UI/UX (`docs/ui-ux/`)
Recursos de diseño y experiencia de usuario:
- `figma.md`: enlaces y notas de diseño en Figma
- `capturas/`: capturas de pantalla del diseño

#### Capturas de aplicación (`docs/img-app/`)
Capturas de pantalla de la aplicación funcionando

#### Políticas (`docs/politicas/`)
Documentos legales y políticas de privacidad

#### Documentación para profesores (`docs/dani/`)
Documentación específica para evaluación académica

### Enlace video demo

[https://youtu.be/gMY0KOfktd0](https://youtu.be/gMY0KOfktd0)


