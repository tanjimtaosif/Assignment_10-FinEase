import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SiteContainer from "../components/SiteContainer";

export default function MainLayout() {
    return (
        <div className="min-h-dvh flex flex-col bg-base-100 text-base-content antialiased">
            {/* Skip to content for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 btn btn-sm btn-primary"
            >
                Skip to content
            </a>

            {/* Top Nav */}
            <Navbar />

            {/* Main content */}
            <main id="main-content" className="relative flex-1">
                {/* Decorative background (subtle, theme-aware) */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-primary/40 to-accent/40 dark:from-primary/30 dark:to-accent/30" />
                    <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-15 bg-gradient-to-tr from-secondary/40 to-info/40 dark:from-secondary/25 dark:to-info/25" />
                </div>

                {/* Page container */}
                <SiteContainer className="py-6 md:py-10">
                    <div className="rounded-2xl bg-base-200/60 backdrop-blur-sm p-4 md:p-6 lg:p-8 shadow-sm">
                        {/* The routed page renders here */}
                        <Outlet />
                    </div>
                </SiteContainer>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
