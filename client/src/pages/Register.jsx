import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, isValidPassword } from "../lib/validate";
import { updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    photoURL: "",
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) return toast.error("Enter a valid email.");
    if (!isValidPassword(form.password))
      return toast.error("Password must be 6+ chars with upper & lower case.");
    try {
      setLoading(true);
      await register(form.email, form.password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: form.name || null,
          photoURL: form.photoURL || null,
        });
      }
      toast.success("Account created!");
      nav(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold">Create your account</h1>
          <p className="mt-1 text-base-content/70">
            Start tracking your income, expenses, and reports.
          </p>
        </div>

        {/* Card (shadow only, no border) */}
        <div className="card bg-base-100 shadow-2xl rounded-2xl">
          <div className="card-body p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-5">
              {/* Full name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full name</span>
                </label>
                <input
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={onChange}
                  required
                  className="w-full h-11 rounded-xl border border-transparent bg-base-100/60 px-3
                             outline-none focus:ring-2 focus:ring-primary/40
                             placeholder:text-base-content/50"
                />
              </div>

              {/* Photo URL (optional) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Photo URL (optional)</span>
                </label>
                <input
                  name="photoURL"
                  placeholder="https://…"
                  value={form.photoURL}
                  onChange={onChange}
                  className="w-full h-11 rounded-xl border border-transparent bg-base-100/60 px-3
                             outline-none focus:ring-2 focus:ring-primary/40
                             placeholder:text-base-content/50"
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email address</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  autoComplete="email"
                  className="w-full h-11 rounded-xl border border-transparent bg-base-100/60 px-3
                             outline-none focus:ring-2 focus:ring-primary/40
                             placeholder:text-base-content/50"
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChange}
                    required
                    autoComplete="new-password"
                    className="w-full h-11 rounded-xl border border-transparent bg-base-100/60 pr-10 px-3
                               outline-none focus:ring-2 focus:ring-primary/40
                               placeholder:text-base-content/50"
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
                <p className="mt-1 text-xs text-base-content/60">
                  Must be at least 6 characters and include uppercase & lowercase letters.
                </p>
              </div>

              {/* Submit */}
              <button
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
                           transition-colors cursor-pointer"
                disabled={loading}
                aria-busy={loading}
                type="submit"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-sm text-base-content/70 text-center mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-primary font-medium cursor-pointer"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
