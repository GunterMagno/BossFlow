# BossFlow - Frontend 👿

Frontend de la aplicación BossFlow desarrollado con **React 18** + **Vite 5.4**.

BossFlow es una aplicación web que permite crear, compartir y gestionar diagramas de flujo interactivos con estrategias para derrotar bosses en videojuegos.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración](#-configuración)
- [Tecnologías](#-tecnologías-utilizadas)
- [Desarrollo](#-desarrollo)

---

## 🔧 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js**: v18.x o superior
- **npm**: v9.x o superior

Verifica las versiones instaladas:
```bash
node -v
npm -v
```

---

## 📦 Instalación

### 1. Clonar el repositorio (si no lo has hecho)

```bash
git clone https://github.com/GunterMagno/BossFlow.git
cd BossFlow/frontend
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`, incluyendo:
- React 18.3.1
- React Router DOM 6.26.0
- Axios 1.7.7
- React Toastify 10.0.5
- React Icons 5.3.0

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz de `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

> ⚠️ **Nota**: Asegúrate de que el backend esté corriendo en el puerto especificado.

---

## 🚀 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run dev`

Inicia el servidor de desarrollo con **Vite**.

```bash
npm run dev
```

- Abre [http://localhost:5173](http://localhost:5173) en tu navegador
- Hot Module Replacement (HMR) habilitado
- Los cambios se reflejan automáticamente

### `npm run build`

Crea una build optimizada para producción en la carpeta `dist/`.

```bash
npm run build
```

- Minifica el código
- Optimiza assets
- Genera source maps
- Lista para deployment

### `npm run preview`

Previsualiza la build de producción localmente.

```bash
npm run preview
```

Útil para verificar que la build funciona correctamente antes del deploy.

### `npm run lint`

Ejecuta ESLint para encontrar problemas en el código.

```bash
npm run lint
```

- Revisa errores de sintaxis
- Verifica buenas prácticas
- Reporta warnings

### `npm run format`

Formatea el código con Prettier (si está configurado).

```bash
npm run format
```

---

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos públicos
│   └── vite.svg           # Favicon y assets públicos
│
├── src/                   # Código fuente de la aplicación
│   ├── assets/            # Imágenes, iconos, fuentes
│   │   └── react.svg
│   │
│   ├── components/        # Componentes reutilizables
│   │   └── [futuros componentes]
│   │
│   ├── contexts/          # Context API de React
│   │   └── [AuthContext, ThemeContext, etc.]
│   │
│   ├── hooks/             # Custom hooks
│   │   └── useHealthCheck.js    # Hook para verificar conexión con backend
│   │
│   ├── pages/             # Páginas/Vistas principales
│   │   ├── Home.jsx       # Página de inicio (Landing)
│   │   └── Home.css       # Estilos de Home
│   │
│   ├── services/          # Servicios para llamadas a la API
│   │   └── api.js         # Configuración de Axios e interceptors
│   │
│   ├── styles/            # Estilos globales
│   │   └── [archivos CSS globales]
│   │
│   ├── utils/             # Funciones auxiliares/helpers
│   │   └── [helpers diversos]
│   │
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos de App
│   ├── main.jsx           # Punto de entrada de React
│   └── index.css          # Estilos globales base
│
├── .env                   # Variables de entorno (no commitear)
├── .gitignore            # Archivos ignorados por Git
├── eslint.config.js      # Configuración de ESLint
├── index.html            # HTML template
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
└── README.md             # Este archivo
```

### 📂 Descripción de carpetas principales

| Carpeta | Descripción |
|---------|-------------|
| **`components/`** | Componentes reutilizables (botones, modals, cards, etc.) |
| **`pages/`** | Componentes que representan páginas completas (Home, Dashboard, Login, etc.) |
| **`services/`** | Lógica de comunicación con APIs (axios, fetch) |
| **`hooks/`** | Custom hooks de React (useAuth, useHealthCheck, etc.) |
| **`contexts/`** | Context API para estado global (autenticación, tema, etc.) |
| **`utils/`** | Funciones auxiliares, helpers, constantes |
| **`assets/`** | Archivos estáticos (imágenes, iconos, fuentes) |
| **`styles/`** | Archivos CSS/SCSS globales |

---

## ⚙️ Configuración

### Variables de Entorno

El proyecto utiliza variables de entorno para configuración sensible. Crea un archivo `.env`:

```env
# URL del backend
VITE_API_URL=http://localhost:5000

# Otras variables (añadir según necesidad)
# VITE_RAWG_API_KEY=tu_api_key_aqui
```

> ⚠️ **Importante**: 
> - Las variables deben empezar con `VITE_` para ser accesibles en el código
> - El archivo `.env` está en `.gitignore` y NO se debe commitear
> - Para producción, configurar las variables en el servicio de hosting

### Acceder a Variables de Entorno

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🛠️ Tecnologías Utilizadas

### Core
- **[React 18.3.1](https://react.dev/)** - Librería de UI
- **[Vite 5.4.0](https://vitejs.dev/)** - Build tool y dev server

### Routing
- **[React Router DOM 6.26.0](https://reactrouter.com/)** - Navegación entre páginas

### HTTP Client
- **[Axios 1.7.7](https://axios-http.com/)** - Cliente HTTP para peticiones a la API

### UI & UX
- **[React Toastify 10.0.5](https://fkhadra.github.io/react-toastify/)** - Notificaciones toast
- **[React Icons 5.3.0](https://react-icons.github.io/react-icons/)** - Librería de iconos

### Diagramas (Futuro)
- **[React Flow](https://reactflow.dev/)** - Editor de diagramas (Sprint 3-4)

### Code Quality
- **[ESLint 8.57.0](https://eslint.org/)** - Linter de JavaScript
- **[Prettier 3.3.3](https://prettier.io/)** - Formateador de código

---

## 💻 Desarrollo

### Flujo de trabajo recomendado

1. **Crear una rama para tu feature/issue**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-descriptivo
   ```

2. **Hacer cambios y commitear**:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

3. **Push y crear PR**:
   ```bash
   git push origin feature/nombre-descriptivo
   gh pr create --base develop
   ```

### Convención de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan lógica)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

### Hot Reload

Vite proporciona **Hot Module Replacement (HMR)** instantáneo:
- Los cambios en componentes React se reflejan sin recargar la página
- Los cambios en CSS se aplican instantáneamente
- Los errores se muestran en el navegador

### ESLint

Para mantener la calidad del código:

```bash
# Ejecutar linter
npm run lint

# Arreglar problemas automáticamente
npm run lint -- --fix
```

---

## 🔗 Enlaces Útiles

- **Repositorio**: [https://github.com/GunterMagno/BossFlow](https://github.com/GunterMagno/BossFlow)
- **Documentación del proyecto**: Ver carpeta `docs/`
- **Product Backlog**: `docs/product-backlog.md`
- **Viabilidad Técnica**: `docs/viabilidad-tecnica.md`

---

## 📝 Notas Adicionales

### Conexión con el Backend

El frontend está configurado para conectarse al backend en desarrollo:
- **Backend URL**: `http://localhost:5000`
- **Health Check**: Verificación automática en `Home.jsx` usando el hook `useHealthCheck`
- **Indicador visual**: Banner verde/rojo mostrando estado de conexión

### Estado del Proyecto (Sprint 1)

✅ **Completado**:
- Setup inicial con Vite
- Componente Home con diseño
- Conexión con backend (health check)
- Variables de entorno configuradas
- Custom hook `useHealthCheck`
- Servicio API con Axios

🚧 **Próximos sprints**:
- Autenticación (JWT)
- Dashboard de usuario
- CRUD de diagramas
- Editor con React Flow

---

## 👥 Equipo

- **Alejandro Borrego Cruz** (@GunterMagno) - Backend Developer
- **Jesús López Pérez** (@jesuuslopeez) - Frontend Developer / Product Owner
- **Daniel Montes Iglesias** (@danielmi5) - Full Stack Developer

---

## 📄 Licencia

ISC License - Ver archivo LICENSE en la raíz del proyecto

---

**Última actualización**: 9 de noviembre de 2024  
**Sprint actual**: Sprint 1 (04/11 - 10/11)
