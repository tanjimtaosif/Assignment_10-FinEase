import { useEffect, useState } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    // Apply and store theme changes
    useEffect(() => {
        document.querySelector("html").setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Toggle between light and dark themes
    const handleToggle = (e) => {
        setTheme(e.target.checked ? "dark" : "light");
    };

    return (
        <div className="navbar bg-base-100 border-b border-base-200 px-4 shadow-sm">
            {/* Left Side (Logo / Brand) */}
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl font-semibold text-primary">
                    FinEase
                </a>
            </div>

            {/* Right Side (Theme Toggle + Buttons) */}
            <div className="flex-none gap-3 items-center">
                {/* Theme Toggle Switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="toggle theme-controller"
                        onChange={handleToggle}
                        checked={theme === "dark"}
                    />
                    <span className="text-sm flex items-center gap-1 font-medium">
                        {theme === "dark" ? (
                            <>
                                <HiOutlineMoon className="text-lg" /> Dark
                            </>
                        ) : (
                            <>
                                <HiOutlineSun className="text-lg" /> Light
                            </>
                        )}
                    </span>
                </label>

                {/* Example button (replace with links or auth controls later) */}
                <button className="btn btn-sm btn-primary hidden sm:inline-flex">
                    Add Transaction
                </button>
            </div>
        </div>
    );
}
