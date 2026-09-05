import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';

// cache-bust marker: an actual statement (comments get stripped by the
// minifier and don't affect the output's content hash) so the built JS
// bundle gets a brand-new filename - the CDN previously cached a stale,
// broken response under the old hash's exact filename on some edge nodes;
// a filename it has never seen can't have that problem.
window.__BOC_BUILD__ = 'force-new-hash-2026-08-19';

// Self-heal stale-tab chunk-load failures: this app's JS is split into
// content-hashed chunks per route (BookDetails-<hash>.js etc). A browser
// tab left open across a deploy still has the OLD index.html in memory, so
// navigating to a route it hasn't loaded yet in this session asks for that
// old chunk's exact filename - which the last build deleted, since each
// build wipes and regenerates dist/assets from scratch. Vite fires this
// event on exactly that failure; reloading re-fetches the current
// index.html (and therefore the current hashes) and fixes it silently,
// instead of showing the user the "Oops! ...Failed to fetch dynamically
// imported module" error page. Guarded with a one-shot sessionStorage flag
// so a genuinely broken deploy (or being offline) can't reload-loop
// forever - it falls back to the normal error page instead.
window.addEventListener('vite:preloadError', () => {
  const guardKey = 'boc-reloaded-after-chunk-error';
  if (sessionStorage.getItem(guardKey)) return;
  sessionStorage.setItem(guardKey, '1');
  window.location.reload();
});
// clear the guard a few seconds after a successful boot, so a LATER stale-
// chunk error (from some future deploy) still gets its own reload attempt
// rather than being silently blocked by a guard flag left over from today
setTimeout(() => sessionStorage.removeItem('boc-reloaded-after-chunk-error'), 10000);

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
const LazyLogin = React.lazy(() => import('./components/Login/Login'));
const LazySignUp = React.lazy(() => import('./components/SignUp/SignUp'));
const LazyCheckout = React.lazy(() => import('./components/Dashboard/Checkout/Checkout'));

// Dashboard/admin-only pages - a regular customer browsing the store never
// needs any of this code, so none of it belongs in their initial bundle.
// Previously every one of these was imported eagerly at the top level,
// meaning every visitor downloaded the entire admin dashboard (add/manage
// book forms, banner management, user/order management, CSV export, etc.)
// whether they'd ever see it or not.
const LazyDashBoardLayout2 = React.lazy(() => import('./components/Layout/DashBoardLayout2/DashBoardLayout2'));
const LazyManageBooks = React.lazy(() => import('./components/Dashboard/ManageBooks/ManageBooks'));
const LazyAdminHome = React.lazy(() => import('./components/Dashboard/AdminHome/AdminHome'));
const LazyAddBooks = React.lazy(() => import('./components/Dashboard/AddBook/AddBooks'));
const LazyAddBanner = React.lazy(() => import('./components/Dashboard/AddBanner/AddBanner'));
const LazyManageBanner = React.lazy(() => import('./components/Dashboard/ManageBanner/ManageBanner'));
const LazyUpdateBook = React.lazy(() => import('./components/Dashboard/UpdateBook/UpdateBook'));
const LazyAllUsers = React.lazy(() => import('./components/Dashboard/AllUsers/AllUsers'));
const LazyAllOrders = React.lazy(() => import('./components/Dashboard/AllOrders/AllOrders'));
const LazyUserHome = React.lazy(() => import('./components/Dashboard/UserHome/UserHome'));
const LazyOrderHistory = React.lazy(() => import('./components/Dashboard/OrderHistory/OrderHistory'));
const LazyMyProfile = React.lazy(() => import('./components/Dashboard/MyProfile/MyProfile'));

// Home was previously imported eagerly here (not through React.lazy like
// every other route) - since main.jsx's top-level imports are never lazy
// regardless of which route is actually being visited, that pulled Home's
// entire dependency tree (swiper for the hero carousel, react-countup,
// react-scroll-trigger/react-intersection-observer for its animations)
// into the critical path of EVERY page load, including e.g. /login, which
// has nothing to do with any of that. Lazy like the rest fixes it.
const LazyHome = React.lazy(() => import('./components/Home/Home/Home'));
import AuthProvider from './providers/AuthProvider/AuthProvider';
import ThemeProvider from './providers/ThemeProvider/ThemeProvider';
import PrivateRoutes from './components/Routes/PrivateRoutes';
import AdminRoute from './components/Routes/AdminRoute';
import CartProvider from './providers/CartProvider/CartProvider';
import Loading from './Loading/Loading';
import ErrorPage from './error-page';



// Default staleTime is 0, which meant every remount of a component that
// calls useBookData (i.e. basically every category/author page navigation,
// since each is its own route element) re-fetched the entire ~700KB/2000+
// book catalog in the background, even though the catalog rarely changes
// mid-session. 5 minutes lets navigation reuse the cached list instead of
// re-downloading it on every click; still short enough that a stock/price
// change from the Google Sheet sync shows up within one page visit.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <React.Suspense fallback={<Loading />}><LazyRoots></LazyRoots></React.Suspense>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <React.Suspense fallback={<Loading />}><LazyHome /></React.Suspense>
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
        element: <React.Suspense fallback={<Loading />}><LazyLogin /></React.Suspense>
      }
      ,
      {
        path: '/signup',
        element: <React.Suspense fallback={<Loading />}><LazySignUp /></React.Suspense>
      }
      ,
      {
        path: '/checkout',
        element: <React.Suspense fallback={<Loading />}><LazyCheckout /></React.Suspense>
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
        element: <React.Suspense fallback={<Loading />}><AdminRoute><LazyAdminHome></LazyAdminHome></AdminRoute></React.Suspense>
      },
      {
        path: 'addBook',
        element: <React.Suspense fallback={<Loading />}><AdminRoute><LazyAddBooks></LazyAddBooks></AdminRoute></React.Suspense>
      },
      {
        path: 'addBanner',
        element: <React.Suspense fallback={<Loading />}><AdminRoute><LazyAddBanner></LazyAddBanner></AdminRoute></React.Suspense>
      },
      {
        path: 'manageBanner',
        element: <React.Suspense fallback={<Loading />}><AdminRoute><LazyManageBanner /></AdminRoute></React.Suspense>
      },
      {
        path: 'manageBooks',

        element: <React.Suspense fallback={<Loading />}> <AdminRoute><LazyManageBooks></LazyManageBooks></AdminRoute></React.Suspense>
      },
      {
        path: 'updateBook/:id',
        element: <React.Suspense fallback={<Loading />}><AdminRoute><LazyUpdateBook></LazyUpdateBook></AdminRoute></React.Suspense>
      },
      {
        path: 'allUsers',
        element: <React.Suspense fallback={<Loading />}><AdminRoute><LazyAllUsers></LazyAllUsers></AdminRoute></React.Suspense>

      },
      {
        path: 'allOrders',
        element: <React.Suspense fallback={<Loading />}><AdminRoute><LazyAllOrders></LazyAllOrders></AdminRoute></React.Suspense>

      },
      {
        path: 'userhome',
        element: <React.Suspense fallback={<Loading />}><LazyUserHome></LazyUserHome></React.Suspense>
      },
      {
        path: 'orderHistory',
        element: <React.Suspense fallback={<Loading />}><LazyOrderHistory></LazyOrderHistory></React.Suspense>
      },
      {
        path: 'myProfile',
        element: <React.Suspense fallback={<Loading />}><LazyMyProfile></LazyMyProfile></React.Suspense>
      }
    ]

  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <HelmetProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </HelmetProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,

)
