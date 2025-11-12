// src/router/AppRouter.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "../layouts/PrivateRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddTransaction from "../pages/AddTransaction";
import MyTransactions from "../pages/MyTransactions";
import TransactionDetails from "../pages/TransactionDetails";
import UpdateTransaction from "../pages/UpdateTransaction";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },

            // auth
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },

            // protected
            { path: "/add-transaction", element: <PrivateRoute><AddTransaction /></PrivateRoute> },
            { path: "/my-transactions", element: <PrivateRoute><MyTransactions /></PrivateRoute> },
            { path: "/reports", element: <PrivateRoute><Reports /></PrivateRoute> },

            // details/edit (protected)
            { path: "/transaction/:id", element: <PrivateRoute><TransactionDetails /></PrivateRoute> },
            { path: "/transaction/update/:id", element: <PrivateRoute><UpdateTransaction /></PrivateRoute> },

            // profile (protected)
            { path: "/profile", element: <PrivateRoute><Profile /></PrivateRoute> },
        ],
    },
    { path: "*", element: <NotFound /> }, 
]);
