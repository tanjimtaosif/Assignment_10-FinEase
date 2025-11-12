// src/components/Navbar.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiOutlineSun, HiOutlineMoon, HiBars3 } from "react-icons/hi2";
import SiteContainer from "./SiteContainer";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/financial.png";


const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium hover:text-primary hover:bg-base-200/60";
const activeClass = "text-primary";

function applyTheme(theme) {
    const html = document.documentElement;
    const body = document.body;
    html.setAttribute("data-theme", theme);
    body.setAttribute("data-theme", theme);
    html.style.colorScheme = theme === "dark" ? "dark" : "light";
}

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    useEffect(() => {
        const close = () => setOpen(false);
        window.addEventListener("hashchange", close);
        window.addEventListener("popstate", close);
        return () => {
            window.removeEventListener("hashchange", close);
            window.removeEventListener("popstate", close);
        };
    }, []);

    const navLinks = useMemo(
        () => (
            <>
                <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}>
                    Home
                </NavLink>
                <NavLink to="/add-transaction" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}>
                    Add Transaction
                </NavLink>
                <NavLink to="/my-transactions" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}>
                    My Transactions
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}>
                    Reports
                </NavLink>
            </>
        ),
        []
    );

    return (
        <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur shadow-sm">
            <SiteContainer>
                <div className="flex h-14 items-center justify-between gap-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl font-semibold text-primary hover:opacity-90"
                        aria-label="FinEase Home"
                    >
                        <img
                            src={logo}
                            alt="FinEase Logo"
                            className="w-8 h-8 object-contain rounded-md transition-all duration-200"
                        />
                        <span>FinEase</span>
                    </Link>


                    {/* center nav (desktop) */}
                    <nav className="hidden md:flex items-center gap-1">{navLinks}</nav>

                    {/* right controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="btn btn-ghost btn-sm cursor-pointer"
                            aria-label="Toggle theme"
                            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
                        >
                            {theme === "dark" ? <HiOutlineMoon className="text-lg" /> : <HiOutlineSun className="text-lg" />}
                        </button>

                        {!user ? (
                            <div className="hidden sm:flex items-center">
                                <Link to="/login" className="btn btn-ghost btn-sm cursor-pointer">Login</Link>
                                <span aria-hidden className="mx-2 h-5 w-px bg-base-300 rounded" />
                                <Link to="/register" className="btn btn-primary btn-sm cursor-pointer">Register</Link>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                {/* Removed the duplicate "Add Transaction" button here */}
                                <Link to="/profile" className="btn btn-ghost btn-sm cursor-pointer">Profile</Link>
                                <button onClick={logout} className="btn btn-ghost btn-sm cursor-pointer">Logout</button>
                            </div>
                        )}

                        <button
                            className="btn btn-ghost btn-sm md:hidden cursor-pointer"
                            aria-label="Open menu"
                            onClick={() => setOpen((s) => !s)}
                        >
                            <HiBars3 className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* mobile menu */}
                {open && (
                    <div className="md:hidden py-2">
                        <div className="flex flex-col gap-1">
                            {navLinks}
                            {!user ? (
                                <>
                                    <Link to="/login" className={`${linkBase} cursor-pointer`}>Login</Link>
                                    <span aria-hidden className="my-1 h-px w-full bg-base-300 rounded" />
                                    <Link to="/register" className={`${linkBase} ${activeClass} cursor-pointer`}>Register</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" className={`${linkBase} cursor-pointer`}>Profile</Link>
                                    <button onClick={logout} className={`${linkBase} text-left cursor-pointer`}>Logout</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </SiteContainer>
        </div>
    );
}
