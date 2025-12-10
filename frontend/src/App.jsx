import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute from './routes/PrivateRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Editor from './pages/Editor';
import Status from './pages/Status';
import Community from './pages/Community';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Layout from './layouts/Layout';

/**
 * Componente principal de la aplicación BossFlow.
 * Define la estructura de rutas y configura los proveedores de contexto.
 * @returns {React.ReactElement} El componente principal de la aplicación.
 */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/status" element={<Status />} />
              <Route path="/community" element={<Community />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/editor/:diagramId" element={
                <PrivateRoute>
                  <Editor />
                </PrivateRoute>} />

              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>} />

              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>} />

              <Route path="/dashboard/plantillas" element={
                <PrivateRoute>
                  <Templates />
                </PrivateRoute>} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
