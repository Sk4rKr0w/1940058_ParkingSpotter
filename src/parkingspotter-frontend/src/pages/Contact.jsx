const Contact = () => {
    return (
        <div className="relative flex justify-center items-center min-h-screen bg-black/50 overflow-hidden">
            <div className="relative z-10 w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 my-5 mx-2">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Contact Us
                </h2>
                <form className="space-y-4">
                    {/* Nome */}
                    <div>
                        <label
                            className="block text-gray-700 font-medium mb-2"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            className="block text-gray-700 font-medium mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    {/* Messaggio */}
                    <div>
                        <label
                            className="block text-gray-700 font-medium mb-2"
                            htmlFor="message"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="Your message..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        ></textarea>
                    </div>

                    {/* Bottone */}
                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition duration-300"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
