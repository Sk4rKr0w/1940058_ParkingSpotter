"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PartnersSlider from "../components/PartnersSlider";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const imgRef = useRef(null);
    const textRef = useRef(null);
    const descRef = useRef(null);

    const gridImgRefs = useRef([]);
    gridImgRefs.current = [];

    const addGridImgRef = (el) => {
        if (el && !gridImgRefs.current.includes(el)) {
            gridImgRefs.current.push(el);
        }
    };

    useEffect(() => {
        if (imgRef.current) {
            gsap.fromTo(
                imgRef.current,
                { opacity: 0, x: 50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.2,
                    ease: "power3.out",
                }
            );
        }

        gridImgRefs.current.forEach((img) => {
            gsap.fromTo(
                img,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: img,
                        start: "top 90%",
                    },
                }
            );
        });

        if (textRef.current) {
            gsap.fromTo(
                textRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    delay: 0.3,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top 85%",
                    },
                }
            );
        }

        if (descRef.current) {
            gsap.fromTo(
                descRef.current,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    delay: 0.3,
                    duration: 1,
                    ease: "power2.out",
                }
            );
        }
    }, []);

    return (
        <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-500 flex flex-col gap-8 items-center justify-center py-12 sm:py-16">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div
                    ref={textRef}
                    className="text-center md:text-left space-y-6 px-4 sm:px-6"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                        Who are we?
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        <span className="font-semibold">ParkingSpotter</span> is
                        the platform designed to make drivers' lives easier.
                        Thanks to our technology, you can search for available
                        parking spots in real time and, if you wish, reserve
                        your spot in advance.
                    </p>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Say goodbye to parking stress: with ParkingSpotter you
                        get up-to-date data, no more aimless driving around, and
                        more time for yourself.
                    </p>
                </div>

                <div className="flex justify-center px-4 sm:px-6">
                    <img
                        ref={imgRef}
                        src="about_bg.jpg"
                        alt="Trova parcheggi facilmente"
                        className=" rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md h-auto"
                    />
                </div>
            </div>

            <hr className="w-[90%] my-10" />

            <div className="max-w-5xl mx-auto text-center space-y-8 px-4 sm:px-6">
                <p
                    ref={descRef}
                    className="text-base sm:text-lg text-gray-600 leading-relaxed"
                >
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Necessitatibus aliquid temporibus soluta illum totam nihil,
                    quae exercitationem delectus corporis? Illum voluptates
                    architecto, rem iure placeat adipisci odio optio corporis
                    dignissimos veritatis dolor nisi libero distinctio quaerat,
                    debitis natus quia minus. Optio ut illo mollitia maiores in
                    iste eius quia corrupti.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 sm:px-6">
                    <img
                        ref={addGridImgRef}
                        src="about_bg.jpg"
                        alt="Logo"
                        className="rounded-2xl shadow-lg object-cover w-full h-48 sm:h-64"
                    />
                    <img
                        ref={addGridImgRef}
                        src="about_bg.jpg"
                        alt="Logo"
                        className="rounded-2xl shadow-lg object-cover w-full h-48 sm:h-64"
                    />
                </div>
            </div>

            <hr className="w-[90%] my-10" />

            <div className="w-full">
                <PartnersSlider />
            </div>
        </section>
    );
};

export default About;
