import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/Layout'
import Home from './pages/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;