// src/components/Footer.jsx
import SiteContainer from "./SiteContainer";
import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
    return (
        // 🔹 Removed outer border-t
        <footer className="bg-base-100">
            <SiteContainer className="py-8">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <h3 className="font-semibold text-base-content/90 text-lg">FinEase</h3>
                        <p className="text-sm text-base-content/70 mt-2 leading-relaxed">
                            Track income & expenses, visualize reports, and stay in control of your finances.
                        </p>
                    </div>

                    {/* Product links */}
                    <nav className="text-sm">
                        <h4 className="font-medium mb-2 text-base-content/90">Product</h4>
                        <ul className="space-y-1 text-base-content/70">
                            <li><a className="link link-hover cursor-pointer">Features</a></li>
                            <li><a className="link link-hover cursor-pointer">Reports</a></li>
                            <li><a className="link link-hover cursor-pointer">Pricing</a></li>
                        </ul>
                    </nav>

                    {/* Company links */}
                    <nav className="text-sm">
                        <h4 className="font-medium mb-2 text-base-content/90">Company</h4>
                        <ul className="space-y-1 text-base-content/70">
                            <li><a className="link link-hover cursor-pointer">About</a></li>
                            <li><a className="link link-hover cursor-pointer">Contact</a></li>
                            <li><a className="link link-hover cursor-pointer">Terms & Privacy</a></li>
                        </ul>
                    </nav>
                </div>

                {/* Bottom row */}
                <div className="mt-8 pt-6 border-t border-base-200 text-xs text-base-content/60 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p>© {new Date().getFullYear()} FinEase. All rights reserved.</p>

                    {/* Social icons */}
                    <div className="flex gap-4">
                        <a href="#" aria-label="Twitter" className="hover:text-primary cursor-pointer"><FaXTwitter size={18} /></a>
                        <a href="#" aria-label="GitHub" className="hover:text-primary cursor-pointer"><FaGithub size={18} /></a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-primary cursor-pointer"><FaLinkedin size={18} /></a>
                    </div>
                </div>
            </SiteContainer>
        </footer>
    );
}
