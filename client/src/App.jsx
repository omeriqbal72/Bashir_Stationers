import { useState } from 'react'
import axios from 'axios'
import AdminPanel from './pages/AdminPanel.jsx'
import AboutUs from './pages/AboutUs.jsx'
import EditProductPage from './pages/EditProductAdmin.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home.jsx'
import Products from './components/ProductPage/ProductPage.jsx'
import Header from './components/Header/Header.jsx'
import './App.css'


axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Router>
        <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App