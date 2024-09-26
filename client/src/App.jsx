import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/Home/Home.jsx';
import Products from './components/ProductPage/ProductPage.jsx';
import AboutUs from './components/About/AboutUs.jsx';
import Product from './components/Product/Product.jsx';
import Cart from './components/Cart/Cart.jsx';
import OrderSummary from './components/Order/OrderSummary.jsx';
import AdminPanel from './components/Admin/AdminPanel.jsx';
import AdminManageProduct from './components/Admin/AdminManageProduct.jsx';
import ProductForm from './components/Admin/ProductForm.jsx';
import EditProductPage from './components/Admin/EditProductAdmin.jsx';

import PublicLayout from './components/Layout/PublicLayout.jsx';
import AdminLayout from './components/Layout/AdminLayout.jsx';
import AdminSuccess from './components/Admin/AdminSuccess.jsx';

import UserAuth from './components/Auth/UserAuth.jsx';
import UserLogin from './components/Auth/UserLoginForm.jsx';
import UserForgotPassword from './components/Auth/UserForgotPassword.jsx';
import UserResetPassword from './components/Auth/UserResetPassword.jsx';
import UserSignup from './components/Auth/UserSignUpForm.jsx';
import UserEmailVerification from './components/Auth/UserEmailVerification.jsx';

import Orders from './components/Order/Orders.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import { UserProvider } from './context/UserContext';
import NotFound from './components/PageNotFound/NotFound.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import './App.css'

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

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
        <UserProvider>
          <CartProvider>
            <OrderProvider>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product" element={<Product />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/login" element={<UserAuth form='Login' component={<UserLogin/>}/>} />
                <Route path="/register" element={<UserAuth form='Sign Up' component={<UserSignup/>}/>} />
                <Route path="/verify-email" element={<UserAuth form='Verify Email' component={<UserEmailVerification/>}/>} />
                <Route path="/forgot-password" element={<UserAuth form='Forgot Password' component={<UserForgotPassword/>}/>} />
                <Route path="/reset-password" element={<UserAuth form='Reset Password' component={<UserResetPassword/>}/>} />
                <Route path="/mycart" element={<Cart />} />
                <Route path="/order-summary" element={<OrderSummary />} />
                <Route path="/myorders" element={<Orders />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Private routes */}
              <Route element={<PrivateRoute adminRoute={true} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin/success-page" element={<AdminSuccess />} />
                  <Route path="/admin/manage-products" element={<AdminManageProduct />} />
                  <Route path="/admin/add-product" element={<ProductForm />} />
                  <Route path="/edit-product/:id" element={<EditProductPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>

            </Routes>
            </OrderProvider>

          </CartProvider>
        </UserProvider>

      </Router>
    </QueryClientProvider>
  );
}

export default App;
