# PrivateRoute - Documentación de Uso

## Ubicación
`src/routes/PrivateRoute.jsx`

## Propósito
Proteger rutas que requieren autenticación. Redirige automáticamente a `/login` si el usuario no está autenticado.

## Cómo usar

### Paso 1: Importar en App.jsx
```jsx
import PrivateRoute from './routes/PrivateRoute';
```

### Paso 2: Envolver el componente que quieres proteger
```jsx
<Route 
  path="/ruta-protegida" 
  element={
    <PrivateRoute>
      <TuComponenteProtegido />
    </PrivateRoute>
  } 
/>
```

## Ejemplo completo

```jsx
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './layouts/Layout'
import PrivateRoute from './routes/PrivateRoute'
import Home from './pages/Home'
import Login from './components/Login/Login'
import Dashboard from './pages/Dashboard'  // Página protegida

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Ruta pública */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Ruta protegida */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

## Funcionamiento

1. **Usuario intenta acceder a ruta protegida**
2. **PrivateRoute verifica**:
   - Si está `loading`: Muestra spinner
   - Si NO está autenticado: Redirige a `/login`
   - Si SÍ está autenticado: Renderiza el componente

## Características

- Usa el contexto `AuthContext` para verificar autenticación
- Muestra loading mientras verifica (evita redirects prematuros)
- Redirige con `replace` (no crea historial innecesario)
- Completamente reutilizable para cualquier ruta

## Requisitos previos

1. `AuthContext` debe estar configurado
2. `AuthProvider` debe envolver la aplicación
3. `useAuth` hook debe retornar `{ isAuthenticated, loading }`

---

**Listo para usar en cualquier ruta que necesite protección.**
