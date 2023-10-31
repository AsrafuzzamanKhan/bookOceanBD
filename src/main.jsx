import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Roots from './Roots/Roots';
import Home from './components/Home/Home/Home';

import CartProvider from './providers/CartProvider/CartProvider';
import BookDetails from './components/BookDetails/BookDetails';
import Books from './components/Books/Books';
import SearchBook from './components/SearchBook/SearchBook';
import AuthProvider from './providers/AuthProvider/AuthProvider';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/signUp';

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
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </HelmetProvider>
    </AuthProvider>
  </React.StrictMode>,

)
