import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Contact = () => {
    const containerRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            const res = await fetch("http://localhost:4003/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setFeedback({
                type: "success",
                message: "Message sent successfully!",
            });
            setFormData({ name: "", email: "", message: "" });
        } catch (err) {
            setFeedback({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    };

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

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
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
                            value={formData.name}
                            onChange={handleChange}
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
                            value={formData.email}
                            onChange={handleChange}
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
                            Message (max 500 characters)
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            maxLength={500}
                            placeholder="Your message..."
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 transition max-h-48"
                            required
                        ></textarea>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                        <div
                            className={`md:col-span-2 text-center font-medium ${
                                feedback.type === "success"
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {feedback.message}
                        </div>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer md:col-span-2 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
