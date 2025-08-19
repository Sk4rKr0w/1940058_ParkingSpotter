"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const PartnersSlider = () => {
    const sliderRef = useRef(null);

    useEffect(() => {
        if (!sliderRef.current) return;

        const list = sliderRef.current;

        // Cloniamo gli elementi per avere un loop fluido
        const clone = list.innerHTML;
        list.innerHTML += clone;

        // Animazione GSAP
        gsap.to(list, {
            x: "-100%",
            ease: "linear",
            duration: 100, // più alto = più lento
            repeat: -1, // loop infinito
        });
    }, []);

    const partners = [
        { src: "/partners/fiat.svg", alt: "Fiat" },
        { src: "/partners/ferrari.svg", alt: "Ferrari" },
        { src: "/partners/audi.svg", alt: "Audi" },
        { src: "/partners/bmw.svg", alt: "BMW" },
        { src: "/partners/ford.svg", alt: "Ford" },
        { src: "/partners/honda.svg", alt: "Honda" },
        { src: "/partners/jeep.svg", alt: "Jeep" },
        { src: "/partners/lamborghini.svg", alt: "Lamborghini" },
        { src: "/partners/peugeot.svg", alt: "Peugeot" },
    ];

    return (
        <div className="overflow-hidden bg-gray-100 py-10 border border-black/50">
            <h1 className="text-2xl font-bold text-center mb-8">
                Our Partners
            </h1>

            <ul ref={sliderRef} className="flex gap-12 whitespace-nowrap w-max">
                {partners.map((partner, index) => (
                    <li key={index} className="flex items-center gap-12">
                        <img
                            src={partner.src}
                            alt={partner.alt}
                            className="h-16 w-auto"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PartnersSlider;
