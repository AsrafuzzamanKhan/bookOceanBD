import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import Roots from './Roots/Roots';
import Home from './components/Home/Home/Home';


import BookDetails from './components/BookDetails/BookDetails';
import Books from './components/Books/Books';
import SearchBook from './components/SearchBook/SearchBook';
import AuthProvider from './providers/AuthProvider/AuthProvider';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/signUp';
import Checkout from './components/Dashboard/Checkout/Checkout';
import DashboardLayout from './components/Layout/DashboardLayout/DashboardLayout';
import AddBooks from './components/Dashboard/AddBook/AddBooks';
import ManageBooks from './components/Dashboard/ManageBooks/ManageBooks';
import PrivateRoutes from './components/Routes/PrivateRoutes';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'// Create a client
import AllUsers from './components/Dashboard/AllUsers/AllUsers';
import OrderHistory from './components/Dashboard/OrderHistory/OrderHistory';
import AdminRoute from './components/Routes/AdminRoute';
import CartProvider from './providers/CartProvider/CartProvider';
import AllOrders from './components/Dashboard/AllOrders/AllOrders';
import AdminHome from './components/Dashboard/AdminHome/AdminHome';
import UserHome from './components/Dashboard/UserHome/UserHome';
import ScrollToTop from './ScrollToTop/ScrollToTop';
import AddBanner from './components/Dashboard/AddBanner/AddBanner';
import ManageBanner from './components/Dashboard/ManageBanner/ManageBanner';
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots></Roots>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/books/:category',
        element: <Books></Books>
      },
      {
        path: '/book/:id',
        element: <BookDetails></BookDetails>
      }
      ,
      {
        path: '/search',
        element: <SearchBook></SearchBook>
      }
      ,
      {
        path: '/login',
        element: <Login />
      }
      ,
      {
        path: '/signup',
        element: <SignUp />
      }
      ,
      {
        path: '/checkout',
        element: <Checkout />
      }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoutes> <DashboardLayout></DashboardLayout></PrivateRoutes>,
    children: [
      {
        path: 'adminhome',
        element: <AdminRoute><AdminHome></AdminHome></AdminRoute>
      },
      {
        path: 'addBook',
        element: <AdminRoute><AddBooks></AddBooks></AdminRoute>
      },
      {
        path: 'addBanner',
        element: <AdminRoute><AddBanner></AddBanner></AdminRoute>
      },
      {
        path: 'manageBanner',
        element: <AdminRoute><ManageBanner /></AdminRoute>
      },
      {
        path: 'manageBooks',
        element: <AdminRoute><ManageBooks></ManageBooks></AdminRoute>
      },
      {
        path: 'allUsers',
        element: <AdminRoute><AllUsers></AllUsers></AdminRoute>

      },
      {
        path: 'allOrders',
        element: <AdminRoute><AllOrders></AllOrders></AdminRoute>

      },
      {
        path: 'userhome',
        element: <UserHome></UserHome>
      },
      {
        path: 'orderHistory',
        element: <OrderHistory></OrderHistory>
      }
    ]

  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HelmetProvider>
          <CartProvider>

            <RouterProvider router={router} />

          </CartProvider>
        </HelmetProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,

)
