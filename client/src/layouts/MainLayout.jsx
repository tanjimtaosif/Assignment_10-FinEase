import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SiteContainer from "../components/SiteContainer";

export default function MainLayout() {
    return (
        <div className="min-h-dvh flex flex-col bg-base-100 text-base-content antialiased">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 btn btn-sm btn-primary z-50">
                Skip to content
            </a>

            <Navbar />

            <main id="main-content" className="relative flex-1">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-primary/40 to-accent/40 dark:from-primary/30 dark:to-accent/30" />
                    <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full blur-3xl opacity-10 bg-gradient-to-tr from-secondary/40 to-info/40 dark:from-secondary/25 dark:to-info/25" />
                </div>

                <SiteContainer className="py-6 md:py-10">
                    <Outlet />
                </SiteContainer>
            </main>

            <Footer />
        </div>
    );
}
