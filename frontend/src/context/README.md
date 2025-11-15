# Context API - Autenticación

Este directorio contiene el contexto global para el manejo de autenticación en BossFlow.

## AuthContext

El `AuthContext` proporciona un contexto global para manejar la autenticación de usuarios en toda la aplicación.

### Características

- **Estado Global**: Mantiene el estado de autenticación accesible desde cualquier componente
- **Persistencia**: Guarda la sesión en `localStorage` para mantener al usuario autenticado
- **Integración con API**: Se conecta automáticamente con el backend a través de axios
- **Manejo de Tokens**: Configura automáticamente los headers de autorización

### Uso

#### 1. Configuración (ya implementada en App.jsx)

```jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Tu aplicación */}
    </AuthProvider>
  );
}
```

#### 2. Usar el hook useAuth en componentes

```jsx
import { useAuth } from '../../context/AuthContext';

function MiComponente() {
  const { user, isAuthenticated, loading, login, logout, register } = useAuth();

  // Verificar si está autenticado
  if (isAuthenticated) {
    console.log('Usuario actual:', user);
  }

  // Login
  const handleLogin = async () => {
    const resultado = await login('email@ejemplo.com', 'contraseña');
    if (resultado.success) {
      console.log('Login exitoso');
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : isAuthenticated ? (
        <div>
          <p>Bienvenido {user.username}</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}
```

### API del Contexto

#### Estado

- **`user`**: Objeto con la información del usuario actual (null si no está autenticado)
- **`isAuthenticated`**: Boolean que indica si hay un usuario autenticado
- **`loading`**: Boolean que indica si se está procesando una operación de autenticación

#### Funciones

##### `login(correo, contrasena)`

Inicia sesión con las credenciales proporcionadas.

**Parámetros:**
- `correo` (string): Email del usuario
- `contrasena` (string): Contraseña del usuario

**Retorna:**
```javascript
{
  success: boolean,
  user?: object,
  error?: string
}
```

##### `register(nombreUsuario, correo, contrasena)`

Registra un nuevo usuario.

**Parámetros:**
- `nombreUsuario` (string): Nombre de usuario deseado
- `correo` (string): Email del usuario
- `contrasena` (string): Contraseña del usuario

**Retorna:**
```javascript
{
  success: boolean,
  user?: object,
  error?: string
}
```

##### `logout()`

Cierra la sesión del usuario actual.

**Retorna:**
```javascript
{
  success: boolean,
  error?: string
}
```

### Ejemplos de Componentes Implementados

Los siguientes componentes ya están usando el AuthContext:

- **`Login.jsx`**: Implementa el formulario de inicio de sesión
- **`Register.jsx`**: Implementa el formulario de registro
- **`Navbar.jsx`**: Muestra el estado de autenticación y opciones de logout

### Flujo de Autenticación

1. El usuario ingresa sus credenciales
2. Se llama a `login()` o `register()`
3. La función hace una petición al backend
4. Si es exitosa, guarda el token y datos del usuario en `localStorage`
5. Actualiza el estado global (`user`, `isAuthenticated`)
6. Configura el token en los headers de axios para futuras peticiones
7. El componente puede redirigir al usuario

### Persistencia de Sesión

El contexto verifica automáticamente al cargar la aplicación si existe una sesión guardada en `localStorage`. Si encuentra un token válido, restaura la sesión del usuario.

### Seguridad

- Los tokens se guardan en `localStorage`
- Los tokens se envían automáticamente en los headers de todas las peticiones a la API
- Al cerrar sesión, se eliminan todos los datos del `localStorage`

## Estructura de Datos

### Usuario

```javascript
{
  id: string,
  username: string,
  email: string,
  // ... otros campos del usuario
}
```

### Token

El token JWT se almacena en `localStorage` con la key `'token'` y se incluye automáticamente en los headers como:

```
Authorization: Bearer <token>
```
