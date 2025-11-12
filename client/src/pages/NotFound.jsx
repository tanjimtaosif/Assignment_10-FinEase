import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-base-content px-6">
            <div className="max-w-lg text-center">
                {/* Illustration */}
                <img
                    src="https://illustrations.popsy.co/gray/error-404.svg"
                    alt="Not Found Illustration"
                    className="w-72 mx-auto mb-6 opacity-90"
                />

                {/* Text Content */}
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
                <p className="mt-3 text-base-content/70 leading-relaxed">
                    Oops! The page you’re looking for doesn’t exist or may have been moved.
                    Let’s get you back on track.
                </p>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <Link to="/" className="btn btn-primary">
                        Go Home
                    </Link>
                    <Link to="/login" className="btn btn-outline">
                        Login Page
                    </Link>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-20 pointer-events-none bg-gradient-to-br from-primary/40 to-secondary/40 blur-3xl"
            />
        </div>
    );
}
