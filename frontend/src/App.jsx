import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Status from './pages/Status';
import NotFound from './pages/NotFound';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Layout from './layouts/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/status" element={<Status />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
    
            {/* Rutas privadas */}
            {/* Añadido en la ruta el parámetro diagramId como opcional (?) para desarrollo, cuando se publique quitarlo */ }
            <Route path="/editor/:diagramId?" element={
              <PrivateRoute>
                <Editor />
              </PrivateRoute>} />
            

            {/* Ruta 404 - debe estar al final */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
