import SiteContainer from "./SiteContainer";

export default function Footer() {
    return (
        <footer className="bg-base-100 border-t border-base-200">
            <SiteContainer className="py-8">
                <div className="grid gap-6 md:grid-cols-3">
                    <div>
                        <h3 className="font-semibold text-base-content/90">FinEase</h3>
                        <p className="text-sm text-base-content/70 mt-2">
                            Track income & expenses, visualize reports, and stay in control.
                        </p>
                    </div>

                    <nav className="text-sm">
                        <h4 className="font-medium mb-2">Product</h4>
                        <ul className="space-y-1 text-base-content/70">
                            <li><a className="link link-hover">Features</a></li>
                            <li><a className="link link-hover">Reports</a></li>
                            <li><a className="link link-hover">Pricing</a></li>
                        </ul>
                    </nav>

                    <nav className="text-sm">
                        <h4 className="font-medium mb-2">Company</h4>
                        <ul className="space-y-1 text-base-content/70">
                            <li><a className="link link-hover">About</a></li>
                            <li><a className="link link-hover">Contact</a></li>
                            <li><a className="link link-hover">Terms & Privacy</a></li>
                        </ul>
                    </nav>
                </div>

                <div className="mt-8 pt-6 border-t border-base-200 text-xs text-base-content/60 flex items-center justify-between">
                    <p>© {new Date().getFullYear()} FinEase. All rights reserved.</p>
                    <div className="flex gap-3">
                        <a className="link link-hover">X</a>
                        <a className="link link-hover">GitHub</a>
                        <a className="link link-hover">LinkedIn</a>
                    </div>
                </div>
            </SiteContainer>
        </footer>
    );
}
