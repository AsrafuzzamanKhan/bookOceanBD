import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'// Create a client

const LazyRoots = React.lazy(() => import('./Roots/Roots'));
const LazyBookDetails = React.lazy(() => import('./components/BookDetails/BookDetails'));
const LazySearchBook = React.lazy(() => import('./components/SearchBook/SearchBook'));
const LazyBooks = React.lazy(() => import('./components/Books/Books'));
const LazyBook = React.lazy(() => import('./components/Book/Book'));
const LazyManageBooks = React.lazy(() => import('./components/Dashboard/ManageBooks/ManageBooks'));
const LazyDashBoardLayout2 = React.lazy(() => import('./components/Layout/DashBoardLayout2/DashBoardLayout2'));
import Home from './components/Home/Home/Home';
import AuthProvider from './providers/AuthProvider/AuthProvider';
import Login from './components/Login/Login';
import Checkout from './components/Dashboard/Checkout/Checkout';
import AddBooks from './components/Dashboard/AddBook/AddBooks';
import SignUp from './components/SignUp/SignUp';
import PrivateRoutes from './components/Routes/PrivateRoutes';
import AllUsers from './components/Dashboard/AllUsers/AllUsers';
import OrderHistory from './components/Dashboard/OrderHistory/OrderHistory';
import AdminRoute from './components/Routes/AdminRoute';
import CartProvider from './providers/CartProvider/CartProvider';
import AllOrders from './components/Dashboard/AllOrders/AllOrders';
import AdminHome from './components/Dashboard/AdminHome/AdminHome';
import UserHome from './components/Dashboard/UserHome/UserHome';
import AddBanner from './components/Dashboard/AddBanner/AddBanner';
import ManageBanner from './components/Dashboard/ManageBanner/ManageBanner';
import UpdateBook from './components/Dashboard/UpdateBook/UpdateBook';
import MyProfile from './components/Dashboard/MyProfile/MyProfile';
import Loading from './Loading/Loading';
import ErrorPage from './error-page';



const queryClient = new QueryClient()
// const locomotiveScroll = new LocomotiveScroll();

const router = createBrowserRouter([
  {
    path: "/",
    element: <React.Suspense fallback={<Loading />}><LazyRoots></LazyRoots></React.Suspense>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/books',
        element: <React.Suspense fallback={<Loading />}> <LazyBooks />
        </React.Suspense>
      },
      {
        path: '/books/:category',
        element: <React.Suspense fallback={<Loading />}> <LazyBook />
        </React.Suspense>
      },
      {
        path: '/authorbooks/:author',
        element: <React.Suspense fallback={<Loading />}> <LazyBook /></React.Suspense>
      },
      {
        // path: '/book/:name',
        path: '/book/:name/:id',
        element: <React.Suspense fallback={<Loading />}><LazyBookDetails></LazyBookDetails></React.Suspense>
      }
      ,
      {
        path: '/search',
        element: <React.Suspense fallback={<Loading />}><LazySearchBook></LazySearchBook></React.Suspense>
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

    element: <React.Suspense fallback={<Loading />}> <PrivateRoutes> <LazyDashBoardLayout2></LazyDashBoardLayout2></PrivateRoutes></React.Suspense>,
    // element: <PrivateRoutes> <DashboardLayout></DashboardLayout></PrivateRoutes>,
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

        element: <React.Suspense fallback="Loading..."> <AdminRoute><LazyManageBooks></LazyManageBooks></AdminRoute></React.Suspense>
      },
      {
        path: 'updateBook/:id',
        element: <AdminRoute><UpdateBook></UpdateBook></AdminRoute>
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
      },
      {
        path: 'myProfile',
        element: <MyProfile></MyProfile>
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
