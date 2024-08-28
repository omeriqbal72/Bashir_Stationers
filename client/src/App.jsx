import { useState } from 'react'
import axios from 'axios'
import Home from './components/Home.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import AboutUs from './pages/AboutUs.jsx'
import './App.css'
import EditProductPage from './pages/EditProductAdmin.jsx'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
