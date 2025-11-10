# BossFlow - Backend

Backend de la aplicación BossFlow desarrollado con Node.js, Express y MongoDB.

## Requisitos previos

- Node.js v24.11.0
- MongoDB
- npm

## Instalación

### 1. Instalar MongoDB (si no lo tienes)

**Opción 1: MongoDB Community Server (Recomendado)**

1. Descarga MongoDB desde: https://www.mongodb.com/try/download/community
2. Selecciona tu sistema operativo (Windows)
3. Descarga el instalador MSI
4. Ejecuta el instalador y sigue los pasos:
   - Selecciona "Complete" installation
   - Marca "Install MongoDB as a Service"
   - Deja las opciones por defecto (puerto 27017)
5. El servicio de MongoDB se iniciará automáticamente

**Opción 2: MongoDB Compass (Interfaz gráfica incluida)**

Si instalaste MongoDB Community Server con las opciones por defecto, MongoDB Compass ya está instalado. Si no:

1. Descarga desde: https://www.mongodb.com/try/download/compass
2. Instala y ejecuta MongoDB Compass
3. Conéctate a `mongodb://localhost:27017`

**Verificar instalación:**

```powershell
Get-Service -Name MongoDB
```

Debería mostrar "Running". Si muestra "Stopped", inícialo:

```powershell
Start-Service -Name MongoDB
```

### 2. Instalar dependencias del proyecto

```bash
npm install
```

### 3. Configurar MongoDB

**Verificar que MongoDB está activo:**

Windows:
```powershell
Get-Service -Name MongoDB
```

Si no está activo, inícialo desde **MongoDB Compass** o desde los servicios de Windows.

**Configuración de la base de datos:**

El backend se conecta por defecto a:
- Host: `127.0.0.1`
- Puerto: `27017`
- Base de datos: `bossflowDB`

La base de datos `bossflowDB` se creará automáticamente la primera vez que ejecutes el servidor.

Si necesitas cambiar la configuración, edita el archivo `config/db.js`:

```javascript
await mongoose.connect("mongodb://127.0.0.1:27017/bossflowDB", {
  // Cambia la URL si necesitas otro host/puerto/base de datos
});
```

## Ejecutar el servidor

### Modo desarrollo (con auto-reload)

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor se iniciará en `http://localhost:8080`

## Endpoints disponibles

- `GET /api` - Verificar que la API está funcionando
- `POST /api/eco` - Endpoint de prueba que devuelve lo que recibe

## Estructura del proyecto

```
backend/
├── config/
│   └── db.js           # Configuración de MongoDB
├── routes/
│   └── index.js        # Rutas de la API
├── server.js           # Punto de entrada del servidor
└── package.json        # Dependencias y scripts
```

## Troubleshooting

### Error: MongoDB connection failed

**Problema:** `❌ Error al conectar con MongoDB`

**Soluciones:**

1. Verifica que MongoDB esté ejecutándose:
```powershell
Get-Service -Name MongoDB
```

2. Si no está corriendo, inícialo:
```powershell
Start-Service -Name MongoDB
```

3. Verifica la conexión con MongoDB Compass:
   - Abre MongoDB Compass
   - Conéctate a `mongodb://localhost:27017`
   - Si conecta, el problema está en la configuración del backend

4. Si MongoDB no está instalado, sigue la sección "Instalar MongoDB" de este README

### Error: Port 8080 already in use

**Problema:** El puerto 8080 ya está en uso

**Solución:**

Cambia el puerto en el archivo `server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Cambia 8080 por el puerto que quieras
```

## Scripts disponibles

- `npm start` - Ejecuta el servidor en modo producción
- `npm run dev` - Ejecuta el servidor con nodemon (auto-reload)

## Tecnologías

- Node.js v24.11.0
- Express v5.1.0
- Mongoose v8.19.3
- MongoDB