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
        <div className="relative flex justify-center min-h-screen items-start bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10"></div>

            <div
                ref={containerRef}
                className="relative z-10 w-full md:w-[75%] bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl my-10 p-5 md:p-10 border border-white/20"
            >
                <h2 className="text-3xl font-extrabold mb-8 text-center text-white">
                    Contact Us
                </h2>

                <form className="flex flex-col md:grid md:grid-cols-2 md:gap-x-10 space-y-6">
                    {/* Name */}
                    <div className="flex flex-col gap-y-2">
                        <label
                            className="block text-white/80 font-medium mb-2"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your name"
                            className="w-full px-2 py-2 md:px-4 md:py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            required
                        />

                        {/* Email */}

                        <label
                            className="block text-white/80 font-medium mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your@email.com"
                            className="w-full px-2 py-2 md:px-4 md:py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            required
                        />
                    </div>

                    {/* Message */}
                    <div className="md:row-span-2">
                        <label
                            className="block text-white/80 font-medium mb-2"
                            htmlFor="message"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="Your message..."
                            className="w-full px-2 py-2 md:px-4 md:py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
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
