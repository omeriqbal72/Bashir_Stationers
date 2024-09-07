import { useState } from 'react';
import axios from 'axios';
import AdminPanel from './components/Admin/AdminPanel.jsx';
import AboutUs from './components/About/AboutUs.jsx';
import EditProductPage from './components/Admin/EditProductAdmin.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Products from './components/ProductPage/ProductPage.jsx';
import Header from './components/Header/Header.jsx';
import './App.css';

// React Query imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 2, 
      staleTime: 1000 * 60 * 5,  
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
