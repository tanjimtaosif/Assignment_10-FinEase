import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const loc = useLocation();
    const from = loc.state?.from?.pathname || "/";

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await login(email, pw);
            nav(from, { replace: true });
        } catch (err) {
            toast.error(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const google = async () => {
        try {
            setLoading(true);
            await loginWithGoogle();
            nav(from, { replace: true });
        } catch (err) {
            toast.error(err.message || "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Heading */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold">Welcome back</h1>
                    <p className="mt-1 text-base-content/70">
                        Log in to manage your transactions and reports.
                    </p>
                </div>

                {/* Card (shadow only, no border) */}
                <div className="card bg-base-100 shadow-2xl rounded-2xl">
                    <div className="card-body p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Email address</span>
                                </label>
                                <input
                                    type="email"
                                    className="w-full h-11 rounded-xl border border-transparent bg-base-100/60 px-3
                             outline-none focus:outline-none
                             focus:ring-2 focus:ring-primary/40 focus:border-transparent
                             placeholder:text-base-content/50"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={show ? "text" : "password"}
                                        className="w-full h-11 rounded-xl border border-transparent bg-base-100/60 pr-10 px-3
                               outline-none focus:outline-none
                               focus:ring-2 focus:ring-primary/40 focus:border-transparent
                               placeholder:text-base-content/50"
                                        placeholder="••••••••"
                                        value={pw}
                                        onChange={(e) => setPw(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShow((s) => !s)}
                                        className="absolute right-3 inset-y-0 flex items-center text-base-content/60 hover:text-base-content cursor-pointer"
                                        aria-label={show ? "Hide password" : "Show password"}
                                        title={show ? "Hide password" : "Show password"}
                                    >
                                        {show ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit (explicit bg color) */}
                            <button
                                type="submit"
                                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
                           transition-colors cursor-pointer"
                                disabled={loading}
                                aria-busy={loading}
                            >
                                {loading ? "Logging in..." : "Log in"}
                            </button>
                        </form>

                        {/* Centered divider */}
                        <div className="my-6 flex items-center">
                            <span className="h-px flex-1 bg-base-300" />
                            <span className="px-4 text-sm text-base-content/60">or</span>
                            <span className="h-px flex-1 bg-base-300" />
                        </div>

                        {/* Google Login */}
                        <button
                            onClick={google}
                            className="btn btn-outline w-full flex items-center justify-center gap-3 font-medium cursor-pointer"
                            disabled={loading}
                            type="button"
                        >
                            <FaGoogle className="text-lg" />
                            Continue with Google
                        </button>

                        {/* Footer */}
                        <p className="text-sm text-base-content/70 text-center mt-5">
                            New here?{" "}
                            <Link
                                to="/register"
                                className="link link-primary font-medium cursor-pointer"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
