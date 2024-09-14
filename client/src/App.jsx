import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/Home/Home.jsx';
import Products from './components/ProductPage/ProductPage.jsx';
import AboutUs from './components/About/AboutUs.jsx';
import Product from './components/Product/Product.jsx';
import AdminPanel from './components/Admin/AdminPanel.jsx';
import AdminManageProduct from './components/Admin/AdminManageProduct.jsx';
import ProductForm from './components/Admin/ProductForm.jsx';
import EditProductPage from './components/Admin/EditProductAdmin.jsx';
import PublicLayout from './components/Layout/PublicLayout.jsx'; // Import Public Layout
import AdminLayout from './components/Layout/AdminLayout.jsx';   // Import Admin Layout
import axios from 'axios';
import Footer from './components/Footer/Footer.jsx'
import './App.css'
import AdminSuccess from './components/Admin/AdminSuccess.jsx';

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
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product" element={<Product />} />
            <Route path="/about" element={<AboutUs />} />
            
          </Route>

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/success-page" element={<AdminSuccess />}/>
            <Route path="/admin/manage-products" element={<AdminManageProduct />} />
            <Route path="/admin/add-product" element={<ProductForm />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
          </Route>
        </Routes>
        
      </Router>
    </QueryClientProvider>
  );
}

export default App;
