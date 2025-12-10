# Arquitectura técnica

## Diagrama de la arquitectura

## Decisiones Técnicas Clave

### 1. Stack MERN
JavaScript full-stack, desarrollo rápido, esquema flexible (MongoDB) para diagramas variables, ecosistema rico.

### 2. Docker + Docker Compose
Consistencia entre desarrollo y producción, aislamiento de servicios, despliegue simple con `docker-compose up`.

### 3. JWT para Autenticación
Stateless (escalabilidad horizontal), no requiere almacenar sesiones en servidor, cross-domain ready.

### 4. React Flow para Editor
Componentes declarativos, drag & drop built-in, nodos personalizables, performance optimizado.

### 5. MongoDB con Nodos Embebidos
Diagramas completos en una query, atomicidad, esquema flexible para evolución rápida.

### 6. Nginx como Proxy Reverso
Alto rendimiento para archivos estáticos, proxy a backend elimina CORS en producción, SSL centralizado.



## Estructura del Proyecto

```
BossFlow/
│
├── backend/                          # API REST (Node.js + Express)
│   ├── config/
│   │   └── database.js              # Conexión MongoDB con Mongoose
│   ├── controllers/                 # Lógica de negocio
│   │   ├── authController.js        # Login, register, checkAuth
│   │   ├── diagramController.js     # CRUD de diagramas
│   │   ├── imageController.js       # Upload/get imágenes
│   │   └── profileController.js     # Gestión de perfil
│   ├── middleware/
│   │   └── auth.js                  # Verificación JWT y autorización
│   ├── models/                      # Schemas Mongoose
│   │   ├── User.js                  # Modelo de Usuario
│   │   └── Diagram.js               # Modelo de Diagrama
│   ├── routes/
│   │   └── index.js                 # Definición de endpoints REST
│   ├── services/
│   │   └── emailService.js          # Envío de emails (Nodemailer)
│   ├── validators/
│   │   └── diagramValidator.js      # Validación de estructura de diagramas
│   ├── tests/                       # Suite de tests automáticos
│   ├── uploads/images/              # Almacenamiento local de imágenes
│   ├── server.js                    # Punto de entrada del servidor
│   └── package.json                 # Dependencias: express, mongoose, jwt, bcrypt
│
├── frontend/                         # SPA React
│   ├── src/
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── Login/              # Formulario de login
│   │   │   ├── Register/           # Formulario de registro
│   │   │   ├── DiagramCard/        # Tarjeta de diagrama (preview)
│   │   │   ├── DiagramList/        # Lista de diagramas
│   │   │   ├── FlowMap/            # Canvas de React Flow
│   │   │   ├── EditorSidebar/      # Panel de herramientas del editor
│   │   │   ├── NodeEditModal/      # Modal para editar nodos
│   │   │   ├── ExportModal/        # Modal de exportación (PNG, PDF, JSON)
│   │   │   └── nodes/              # Nodos personalizados de React Flow
│   │   │       ├── StartNode/      # Nodo de inicio
│   │   │       ├── ActionNode/     # Nodo de acción
│   │   │       ├── DecisionNode/   # Nodo de decisión
│   │   │       └── EndNode/        # Nodo de fin
│   │   ├── context/                # Estado global (Context API)
│   │   │   ├── AuthContext.jsx     # user, token, login, logout, checkAuth
│   │   │   └── ToastContext.jsx    # Notificaciones globales
│   │   ├── pages/                  # Páginas completas
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Dashboard.jsx      # Dashboard de diagramas
│   │   │   ├── Editor.jsx         # Editor de diagramas
│   │   │   ├── Profile.jsx        # Perfil de usuario
│   │   │   ├── Templates.jsx      # Plantillas
│   │   │   └── Community.jsx      # Diagramas públicos
│   │   ├── services/              # Capa de abstracción para API
│   │   │   ├── api.js            # Cliente Axios configurado (interceptors)
│   │   │   ├── authService.js    # login, register, checkAuth, logout
│   │   │   ├── diagramService.js # CRUD diagramas
│   │   │   ├── imageService.js   # Upload/get imágenes
│   │   │   └── profileService.js # Gestión de perfil
│   │   ├── hooks/                # Custom hooks
│   │   │   ├── useExportDiagram.js  # Exportar a PNG, PDF, JSON
│   │   │   └── useHealthCheck.js    # Health check del backend
│   │   ├── routes/
│   │   │   └── PrivateRoute.jsx  # HOC para proteger rutas autenticadas
│   │   ├── App.jsx               # Componente raíz con rutas
│   │   └── main.jsx              # Punto de entrada
│   ├── nginx.conf                # Configuración Nginx (proxy /api → backend)
│   ├── vite.config.js            # Configuración Vite (dev server, proxy)
│   └── package.json              # Dependencias: react, react-flow, axios
│
├── docs/                            # Documentación del proyecto
│
├── docker-compose.yml              # Dockerización de los servicios (con dos versiones una para producción "prod" y otro para desarrollo "dev")
```

### División Principal

**Backend (Node.js + Express):** Configuración del backend
- `controllers/`: Lógica de negocio por funcionalidad
- `models/`: Esquemas de MongoDB (Mongoose)
- `routes/`: Endpoints de la API REST
- `middleware/`: Autenticación, validaciones, manejo de errores
- `services/`: Integraciones externas (email, storage futuro)

**Frontend (React + Vite):** Configuración del frontend
- `pages/`: Componentes de página completa (rutas principales)
- `components/`: Componentes reutilizables de UI
- `context/`: Estado global (Auth, Toast)
- `services/`: Abstracción de llamadas API
- `hooks/`: Lógica reutilizable (useExport, useHealthCheck)

**Docker:**
- 3 servicios: `frontend` (Nginx + React), `backend` (Node.js), `mongo` (MongoDB)
- Red `app-network` para comunicación interna
- Volumen `mongo-data` para persistencia

## Flujos
