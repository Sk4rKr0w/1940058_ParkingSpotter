import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Info from "../components/Info";

const Home = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");

    const cardsData = [
        {
            title: "Our goals",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem harum eum quasi ut repellat, esse quis accusamus expedita culpa voluptates, officia eligendi in aperiam quia.",
        },
        {
            title: "Our mission",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem harum eum quasi ut repellat, esse quis accusamus expedita culpa voluptates, officia eligendi in aperiam quia.",
        },
        {
            title: "What we see for the future",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem harum eum quasi ut repellat, esse quis accusamus expedita culpa voluptates, officia eligendi in aperiam quia.",
        },
    ];

    const infoData = [
        {
            title: "Discover Nearby Parking Spots",
            isReverted: false,
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi error cupiditate tenetur itaque perferendis voluptatum soluta illo saepe magni, sed enim deserunt nulla culpa ullam?",
            imgSrc: "../home/homeCard1.png",
        },
        {
            title: "Easy Booking Process",
            isReverted: true,
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi error cupiditate tenetur itaque perferendis voluptatum soluta illo saepe magni, sed enim deserunt nulla culpa ullam?",
            imgSrc: "../home/homeCard2.png",
        },
        {
            title: "Secure Payments",
            isReverted: false,
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi error cupiditate tenetur itaque perferendis voluptatum soluta illo saepe magni, sed enim deserunt nulla culpa ullam?",
            imgSrc: "../home/homeCard3.png",
        },
    ];

    const socialData = [
        { link: "https://www.facebook.com", icon: "socials/facebook_logo.svg" },
        { link: "https://www.x.com", icon: "socials/x_logo.svg" },
        {
            link: "https://www.instagram.com",
            icon: "socials/instagram_logo.svg",
        },
        { link: "https://www.linkedin.com", icon: "socials/linkedin_logo.svg" },
    ];

    const handleSearch = () => {
        const token = localStorage.getItem("token");

        if (!searchInput.trim()) {
            alert("Inserisci un testo per la ricerca!");
            return;
        }

        if (token) {
            // Store the search query in localStorage
            localStorage.setItem("searchQuery", searchInput);
            navigate("/reservation");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center bg-[#171717]">
            <div
                className="relative flex flex-col items-center justify-around w-full gap-y-5"
                style={{
                    backgroundImage: "url('../home/parkingLot.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="mt-10 text-center">
                    <h1 className="text-orange-800 text-2xl md:text-3xl font-bold mb-4">
                        PARKING SPOTTER
                    </h1>
                    <p className="text-black font-medium text-md md:text-lg">
                        Find your perfect parking spot with ease!
                    </p>
                </div>

                {/* Search Input */}
                <div className="w-full flex flex-col md:flex-row justify-center items-center">
                    <input
                        type="text"
                        placeholder="Search for a parking spot"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="bg-white px-4 py-2 w-[70%] md:w-[40%] rounded-lg md:rounded-none md:rounded-l-lg border border-gray-500 italic"
                    />
                    <button
                        onClick={handleSearch}
                        className="w-[70%] md:w-auto mt-3 md:mt-0 bg-orange-600 text-white px-6 py-2 rounded-lg md:rounded-none md:rounded-r-lg hover:bg-orange-700 transition"
                    >
                        Search
                    </button>
                </div>

                {/* Cards Section */}
                <div className="text-white flex flex-col md:flex-row m-10 gap-8 md:gap-4">
                    {cardsData.map((card, index) => (
                        <Card key={index} title={card.title} text={card.text} />
                    ))}
                </div>
            </div>

            {/* Info Section */}
            <div className="w-full flex flex-col justify-center items-center">
                <div className="w-full md:w-[75%]">
                    {infoData.map((info, index) => (
                        <Info
                            key={index}
                            title={info.title}
                            isReverted={info.isReverted}
                            text={info.text}
                            src={info.imgSrc}
                        />
                    ))}
                </div>
            </div>

            <hr className="h-0.5 bg-white w-[75%]" />

            <div className="flex flex-col justify-center items-center my-6 gap-4">
                <h1 className="text-white text-center text-xl md:text-2xl">
                    Follow us on our socials!
                </h1>
                <div className="grid grid-cols-4 gap-10">
                    {socialData.map((social, index) => (
                        <a
                            key={index}
                            href={social.link}
                            className="flex justify-center items-center hover:scale-150 transition-transform duration-300"
                        >
                            <img
                                src={social.icon}
                                alt={`${social.name} logo`}
                                className="w-8 md:w-10 h-8 md:h-10"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
