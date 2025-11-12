import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css"; // tailwind directives

export default function App() {
    return (
        <AuthProvider>
            {/* Global toaster (DaisyUI-friendly colors) */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    className:
                        "bg-base-100 text-base-content border border-base-300 shadow",
                }}
            />
            <RouterProvider router={router} />
        </AuthProvider>
    );
}
