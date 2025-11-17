import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Status from './pages/Status';
import NotFound from './pages/NotFound';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

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

            {/* Ruta 404 - debe estar al final */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
