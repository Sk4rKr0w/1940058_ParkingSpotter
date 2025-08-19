import Card from "../components/Card";
import Info from "../components/Info";
const Home = () => {
    const cardsData = [
        {
            title: "I nostri obiettivi",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem harum eum quasi ut repellat, esse quis accusamus expedita culpa voluptates, officia eligendi in aperiam quia.",
            src: "parkingLot.jpg",
        },
        {
            title: "La nostra missione",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem harum eum quasi ut repellat, esse quis accusamus expedita culpa voluptates, officia eligendi in aperiam quia.",
            src: "manWithPhone.png",
        },
        {
            title: "La nostra visione",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem harum eum quasi ut repellat, esse quis accusamus expedita culpa voluptates, officia eligendi in aperiam quia.",
            src: "parkingLot.jpg",
        },
    ];

    const socialData = [
        {
            link: "https://www.facebook.com",
            icon: "socials/facebook_logo.svg",
        },
        {
            link: "https://www.x.com",
            icon: "socials/x_logo.svg",
        },
        {
            link: "https://www.instagram.com",
            icon: "socials/instagram_logo.svg",
        },
        {
            link: "https://www.linkedin.com",
            icon: "socials/linkedin_logo.svg",
        },
    ];

    return (
        <div className="flex flex-col justify-center items-center bg-[#171717]">
            <div
                className="relative flex flex-col items-center justify-around w-full gap-y-5"
                style={{
                    backgroundImage: "url('/parkingLot.jpg')",
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
                <div className="w-full flex flex-col justify-center items-center">
                    <input
                        type="text"
                        placeholder="Search for a parking spot"
                        className="bg-white px-4 py-2 w-[70%] md:w-[40%] rounded-lg border italic"
                    />
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
                    <Info isReverted={false} />
                    <Info isReverted={true} />
                    <Info isReverted={false} />
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
