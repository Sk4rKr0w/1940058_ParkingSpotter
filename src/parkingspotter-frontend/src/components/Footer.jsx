const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6">
            <div className="mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-lg font-semibold text-white">
                    <img
                        src="/footerLogo.png"
                        alt="Parking Spotter Logo"
                        className="h-14"
                    />
                </div>

                <div className="flex space-x-6">
                    <a href="/privacy" className="hover:text-white transition">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="hover:text-white transition">
                        Terms of Service
                    </a>
                    <a href="/contact" className="hover:text-white transition">
                        Contact
                    </a>
                </div>

                <div className="text-sm text-gray-500">
                    © {new Date().getFullYear()} PrivaTerms. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
};
export default Footer;
