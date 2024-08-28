import { useState } from 'react'
import axios from 'axios'
import Home from './components/Home/Home.jsx'
import Products from './components/ProductPage/ProductPage.jsx'
import Header from './components/Header/Header.jsx'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
      </Routes>
    </Router>
    </>
  )
}

export default App