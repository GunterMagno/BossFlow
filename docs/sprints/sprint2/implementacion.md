# Sprint 2 - P3: Implementación Context API para Auth

**Asignado a:** Jesús López Pérez (@jesuuslopeez)  
**Rol:** Scrum Master  
**Estimación:** 4h  
**Prioridad:** 3  

## ✅ Tareas Completadas

### 1. ✅ Crear AuthContext.jsx

**Archivo:** `/frontend/src/context/AuthContext.jsx`

Se creó el contexto global de autenticación con:
- Creación del contexto usando `createContext`
- Hook personalizado `useAuth()` para facilitar el uso del contexto
- Provider `AuthProvider` que envuelve la aplicación

### 2. ✅ Implementar AuthProvider

El `AuthProvider` incluye:
- Inicialización del estado de autenticación
- Verificación de sesión al cargar la app desde `localStorage`
- Configuración automática de headers de axios con el token

### 3. ✅ Crear funciones: login, logout, register

#### `login(correo, contrasena)`
- Hace POST a `/api/auth/login`
- Guarda token y usuario en `localStorage`
- Configura headers de autorización
- Retorna objeto con `success` y `user` o `error`

#### `register(nombreUsuario, correo, contrasena)`
- Hace POST a `/api/auth/register`
- Guarda token y usuario en `localStorage`
- Configura headers de autorización
- Retorna objeto con `success` y `user` o `error`

#### `logout()`
- Limpia `localStorage`
- Elimina headers de autorización
- Resetea el estado a valores iniciales
- Retorna objeto con `success`

### 4. ✅ Mantener estado: user, isAuthenticated, loading

Estados implementados:
- **`user`**: Objeto con información del usuario (null si no está autenticado)
- **`isAuthenticated`**: Boolean que indica si hay usuario autenticado
- **`loading`**: Boolean que indica si hay una operación en proceso

### 5. ✅ Usar useContext en componentes

Se actualizaron los siguientes componentes para usar `useAuth()`:

#### **App.jsx**
- Envuelve toda la aplicación con `<AuthProvider>`

#### **Login.jsx**
- Usa `useAuth()` para acceder a `login`, `loading`, `isAuthenticated`
- Redirige automáticamente si ya está autenticado
- Llama a `login()` al enviar el formulario
- Maneja errores del servidor

#### **Register.jsx**
- Usa `useAuth()` para acceder a `register`, `loading`, `isAuthenticated`
- Redirige automáticamente si ya está autenticado
- Llama a `register()` al enviar el formulario
- Maneja errores del servidor

#### **Navbar.jsx**
- Usa `useAuth()` para acceder a `user`, `isAuthenticated`, `logout`
- Muestra botones de login/register si NO está autenticado
- Muestra menú de usuario con nombre si está autenticado
- Implementa función de cerrar sesión

## 📁 Archivos Creados/Modificados

### Creados
1. `/frontend/src/context/AuthContext.jsx` - Contexto de autenticación
2. `/frontend/src/context/README.md` - Documentación del contexto

### Modificados
1. `/frontend/src/App.jsx` - Agregado AuthProvider
2. `/frontend/src/components/Login/Login.jsx` - Integración con AuthContext
3. `/frontend/src/components/Register/Register.jsx` - Integración con AuthContext
4. `/frontend/src/components/Navbar/Navbar.jsx` - Integración con AuthContext

## 🔧 Características Implementadas

### Persistencia de Sesión
- Los datos del usuario y token se guardan en `localStorage`
- Al recargar la página, la sesión se restaura automáticamente
- El token se incluye en todas las peticiones HTTP

### Manejo de Errores
- Captura errores del servidor y los propaga a los componentes
- Mensajes de error personalizados para el usuario
- Limpieza automática de datos corruptos

### Seguridad
- Tokens JWT en headers de autorización
- Limpieza completa de datos al cerrar sesión
- Validación de sesión al iniciar la app

### UX/UI
- Estados de carga durante operaciones asíncronas
- Redirección automática si el usuario ya está autenticado
- Navegación fluida tras login/register exitoso

## 🧪 Testing

Para probar la implementación:

1. **Registro de usuario:**
   - Ir a `/register`
   - Completar el formulario
   - Verificar redirección y actualización del Navbar

2. **Login:**
   - Ir a `/login`
   - Ingresar credenciales
   - Verificar redirección y actualización del Navbar

3. **Persistencia:**
   - Autenticarse
   - Recargar la página
   - Verificar que la sesión se mantiene

4. **Logout:**
   - Click en "Cerrar sesión" del menú del usuario
   - Verificar limpieza de datos y redirección

## 📝 Notas de Implementación

- El contexto usa axios interceptors para manejar tokens automáticamente
- Se implementó un hook personalizado `useAuth()` para simplificar el uso
- Todas las funciones retornan objetos con estructura consistente `{success, data/error}`
- El estado `loading` del contexto puede usarse para mostrar spinners globales
- Se creó documentación completa en `/frontend/src/context/README.md`

## 🎯 Próximos Pasos Sugeridos

1. Crear componente de ruta protegida (PrivateRoute)
2. Implementar refresh de tokens
3. Agregar manejo de expiración de sesión
4. Crear página de perfil de usuario
5. Implementar recuperación de contraseña

---

**Estado:** ✅ Completado  
**Fecha de implementación:** 15 de noviembre de 2025
