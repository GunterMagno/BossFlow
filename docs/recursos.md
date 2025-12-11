# Recursos materiales

## 1. Distribución de Roles y Responsabilidades

| Sprint | Fechas | Jesús | Alejandro | Daniel |
|--------|--------|--------|-----------|----------|
| **Sprint 1** | 31 Oct - 6 Nov 2024 | Product Owner | Scrum Master | Developer |
| **Sprint 2** | 7 Nov - 13 Nov 2024 | Scrum Master | Developer | Product Owner |
| **Sprint 3** | 14 Nov - 20 Nov 2024 | Developer | Product Owner | Scrum Master |
| **Sprint 4** | 21 Nov - 27 Nov 2024 | Product Owner | Scrum Master | Developer |
| **Sprint 5** | 28 Nov - 4 Dic 2024 | Scrum Master | Developer | Product Owner |
| **Sprint 6** | 5 Dic - 12 Dic 2024 | Developer | Product Owner | Scrum Master |

---

## 2. Stack Tecnológico Completo

El stack tecnológico que vamos a utilizar es **MERN**, que se compone de **MongoDB**, **Express.js**, **React** y **Node.js**

- **MongoDB**: Para almacenar los datos en una base de datos **_NoSQL_**.
- **Express.js**: Para crear y manejar el servidor y las rutas **_API_** del **_Backend_**.
- **React**: Para construir la interfaz de usuario interactiva.
- **Node.js**: Para ejecutar el código del servidor y conectar el **_Frontend_** con la base de datos.

### 2.1 Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 18.3.1 | Librería principal para construir la interfaz de usuario |
| **Vite** | 5.4.21 | Build tool y servidor de desarrollo con HMR |
| **React Router DOM** | 6.26.0 | Navegación y enrutamiento SPA |
| **React Flow** | 11.11.4 | Editor de diagramas interactivo con nodos personalizables |
| **Axios** | 1.7.7 | Cliente HTTP para peticiones a la API REST |
| **React Toastify** | 10.0.5 | Sistema de notificaciones toast |
| **React Icons** | 5.5.0 | Librería de iconos (Font Awesome, Material, etc.) |
| **html-to-image** | 1.11.11 | Exportación de diagramas como imágenes PNG/JPG |
| **jsPDF** | 3.0.4 | Generación de PDFs para exportación de diagramas |
| **ESLint** | 8.57.1 | Linter de código JavaScript/JSX |
| **Prettier** | 3.3.3 | Formateador de código |

### 2.2 Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | v18.x+ | Runtime JavaScript del servidor |
| **Express** | 5.1.0 | Framework web minimalista para API REST |
| **MongoDB** | 4.4 | Base de datos NoSQL |
| **Mongoose** | 8.19.3 | ODM para modelado y validación de datos |
| **bcrypt** | 6.0.0 | Hash de contraseñas con salt rounds |
| **jsonwebtoken** | 9.0.2 | Generación y verificación de tokens JWT |
| **CORS** | 2.8.5 | Middleware para habilitar Cross-Origin Resource Sharing |
| **dotenv** | 17.2.3 | Carga de variables de entorno |
| **validator** | 13.15.23 | Validaciones de datos (emails, URLs, etc.) |
| **nodemailer** | 6.9.7 | Envío de emails (verificación, notificaciones) |
| **nodemon** | 3.1.10 | Auto-reinicio del servidor en desarrollo |

### 2.3 DevOps e Infraestructura

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Docker** | Latest | Contenedorización de servicios |
| **Docker Compose** | v3.8 | Orquestación multi-contenedor (frontend, backend, mongo) |
| **Nginx** | Latest | Servidor web y proxy reverso en producción |
| **Git** | Latest | Control de versiones |
| **GitHub** | - | Hosting del repositorio y colaboración |
| **Github Action** | - | Para CI y CD |

---

## 3 Servicios Contratados

| Servicio | Proveedor | Plan | Coste Mensual | Especificaciones |
|----------|-----------|------|---------------|------------------|
| **Hosting VPS** | IONOS | VPS S | 4 € | 2GB RAM, 80GB SSD, 1 vCore |
| **Base de Datos** | MongoDB (Dockerizado) | Self-hosted | 0 € | Incluido en VPS |
| **Dominio** | GitHub Student Pack | .me | 0 € | Dominio gratuito durante 1 año |

**Total Infraestructura:** 4 €/mes (48 €/año)


---

## 4. Servicios Externos y APIs

### 4.1 APIs de Terceros

| API | Uso | Plan | Límites | Coste |
|-----|-----|------|---------|-------|
| **RAWG.io** | Información de videojuegos y bosses | Free Tier | 20,000 requests/mes (planificado, no implementado aún) | 0 € |

**Estado:** Planificada para futuras versiones. Actualmente los usuarios introducen manualmente el nombre del juego y boss.

### 4.2 Servicios de Email

| Servicio | Uso | Configuración |
|----------|-----|---------------|
| **Nodemailer** | Envío de emails de verificación y notificaciones | SMTP configurado |
| **Gmail SMTP** (Producción) | Transporte de emails en prod | `process.env.EMAIL_USER`, `process.env.EMAIL_PASSWORD` |
| **Ethereal Email** (Desarrollo) | SMTP de prueba en desarrollo | Generación automática de cuentas test |

### 4.3 Servicios de Autenticación

| Tecnología | Implementación | Detalles |
|------------|----------------|----------|
| **JWT** | Tokens stateless para autenticación | Expiración configurable (remember me: 7d / normal: 24h) |
| **bcrypt** | Hash de contraseñas | Salt rounds: 10 |
| **Middleware auth** | Verificación de tokens en rutas protegidas | Decodifica y valida JWT en cada request |

---

## 5. Herramientas de Desarrollo y Gestión

### 5.1 Entornos de Desarrollo

| Herramienta | Uso |
|-------------|-----|
| **VScode** | IDE principal para desarrollo Full Stack |
| **WebStorm** | Desarrollo avanzado de Frontend |

### 5.2 Testing y Debug

| Herramienta | Uso |
|-------------|-----|
| **Insomnia** | Cliente HTTP para testing manual de API REST |
| **React DevTools** | Inspección de componentes React y estado |
| **MongoDB Compass** | GUI para inspección de base de datos |
| **Docker Desktop** | Gestión visual de contenedores |

### 5.3 Control de Versiones y Colaboración

| Herramienta | Uso |
|-------------|-----|
| **Git** | Control de versiones distribuido |
| **GitHub** | Hosting del repositorio, issues, pull requests |
| **GitHub Projects** | Gestión de tareas y sprints |

### 5.4 Diseño y Prototipado

| Herramienta | Uso |
|-------------|-----|
| **Figma** | Diseño de interfaces y prototipos UX/UI |
| **Mermaid** | Diagramas de arquitectura y flujos |

### 5.5 Documentación

| Herramienta | Uso |
|-------------|-----|
| **Markdown** | Documentación técnica del proyecto |
| **JSDoc** | Documentación inline de funciones backend |
| **React Docgen** | Documentación de componentes React |
| **Mermaid Chart** | Diagramas de arquitectura interactivos |

## 6. Credenciales y Accesos

### 6.1 Gestión de Secretos

**Herramientas utilizadas:**
- **Bitwarden**: Gestor de contraseñas compartido del equipo
- **1Password**: Gestión de credenciales empresariales

### 6.2 Variables de Entorno

**Backend (`.env`):**
```env
NODE_ENV=production
BACKEND_PORT=5000
MONGO_URI=mongodb://mongo:27017/bossflow
JWT_SECRET=<secret_token>
EMAIL_USER=<gmail_user>
EMAIL_PASSWORD=<gmail_app_password>
```

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:5000
# En producción: VITE_API_URL="" (rutas relativas via proxy Nginx)
```

### 6.3 Accesos Compartidos

| Servicio | Acceso | Ubicación |
|----------|--------|-----------|
| **VPS IONOS** | SSH key + password | Bitwarden vault del equipo |
| **MongoDB** | Connection string | Variables de entorno |
| **GitHub Repo** | Colaboradores con permisos push | github.com/GunterMagno/BossFlow |
| **Gmail SMTP** | App password | Bitwarden vault |
| **Dominio** | Credenciales DNS | GitHub Student Pack account |


## 7. Servicios externos y APIs a utilizar.  

- Vamos a hacer uso de una **API** llamada [**Rawg.io**](https://rawg.io/), la cual nos proporcionará nombres e información sobre videojuegos (Aún no implementada). 