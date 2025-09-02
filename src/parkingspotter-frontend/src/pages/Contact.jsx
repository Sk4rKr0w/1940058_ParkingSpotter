import { useEffect, useRef } from "react";
import gsap from "gsap";

const Contact = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <div className="relative flex justify-center min-h-screen items-start bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8">
            <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10"></div>

            <div
                ref={containerRef}
                className="relative z-5 w-full max-w-3xl bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl my-10 p-6 sm:p-8 md:p-10 border border-white/20"
            >
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center text-white">
                    Contact Us
                </h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-y-3">
                        <label
                            className="block text-white/80 font-medium"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-y-3">
                        <label
                            className="block text-white/80 font-medium"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            required
                        />
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2 flex flex-col gap-y-3">
                        <label
                            className="block text-white/80 font-medium"
                            htmlFor="message"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="Your message..."
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 transition max-h-48"
                            required
                        ></textarea>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="md:col-span-2 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
