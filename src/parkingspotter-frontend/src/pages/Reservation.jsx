"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import MapComponent from "../components/MapComponent";

const Reservation = () => {
    const textRefs = useRef([]);
    const containerRef = useRef(null);

    useEffect(() => {
        // Animazione titolo e paragrafo
        gsap.fromTo(
            textRefs.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power1.out", stagger: 0.3 }
        );

        // Animazione MapComponent
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.5,
                }
            );
        }
    }, []);

    return (
        <div className="text-center flex flex-col min-h-screen bg-gradient-to-br from-orange-500 to-orange-200 p-4 md:p-8">
            <h1
                ref={(el) => (textRefs.current[0] = el)}
                className="mt-2 font-medium text-2xl md:text-3xl text-white drop-shadow-md"
            >
                Make your own reservation!
            </h1>
            <p
                ref={(el) => (textRefs.current[1] = el)}
                className="mt-2 text-lg md:text-xl text-white drop-shadow-sm"
            >
                Looking for a spot? Search for your location and hope for a free
                parking spot
            </p>

            <div className="mt-6" ref={containerRef}>
                <MapComponent />
            </div>
        </div>
    );
};

export default Reservation;
