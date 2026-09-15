"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/hero/opportunities.jpg",
    badge: "OPPORTUNITIES • GROWTH • GLOBAL CONNECTIONS",
    title: "Connecting Africa to Opportunities.",
    highlight: "Discover your next possibility.",
    description:
      "Discover verified jobs, scholarships, grants, fellowships, internships, business opportunities and other pathways for growth.",
    buttonText: "Explore Opportunities",
    buttonLink: "#ecosystem",
  },

  {
    image: "/images/hero/education.jpg",
    badge: "EDUCATION • KNOWLEDGE • SKILLS",
    title: "Knowledge can",
    highlight: "change your future.",
    description:
      "Explore universities, study opportunities, professional training, digital skills and educational resources designed to help you grow.",
    buttonText: "Explore Education",
    buttonLink: "#ecosystem",
  },

  {
    image: "/images/hero/business.jpg",
    badge: "BUSINESS • INNOVATION • TECHNOLOGY",
    title: "Helping African businesses",
    highlight: "grow stronger.",
    description:
      "Access practical business solutions, AI branding, digital transformation, consulting, automation, trade and sourcing opportunities.",
    buttonText: "Grow Your Business",
    buttonLink: "#ecosystem",
  },

  {
    image: "/images/hero/africa-global.jpg",
    badge: "AFRICA • PARTNERSHIPS • GLOBAL MARKETS",
    title: "Connecting Africa",
    highlight: "to the world.",
    description:
      "Creating stronger connections between African talent, businesses, opportunities, international markets and strategic partnerships.",
    buttonText: "Connect Globally",
    buttonLink: "#partners",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((previousSlide) =>
        previousSlide === slides.length - 1
          ? 0
          : previousSlide + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  function goToSlide(index: number) {
    setCurrentSlide(index);
  }

  function previousSlide() {
    setCurrentSlide((previousSlide) =>
      previousSlide === 0
        ? slides.length - 1
        : previousSlide - 1
    );
  }

  function nextSlide() {
    setCurrentSlide((previousSlide) =>
      previousSlide === slides.length - 1
        ? 0
        : previousSlide + 1
    );
  }

  return (
    <section className="relative min-h-[620px] overflow-hidden bg-[#071d45] sm:min-h-[660px] lg:min-h-[720px]">

      {/* BACKGROUND IMAGES */}

      {slides.map((item, index) => (
        <div
          key={item.image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#071d45]/35 via-[#071d45]/30 to-[#071d45]/30" />

      {/* GRADIENT */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#071d45]/95 via-[#071d45]/75 to-[#071d45]/30" />

      {/* CONTENT */}

      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-16 sm:min-h-[660px] sm:py-20 lg:min-h-[720px] lg:px-8 lg:py-24">

        <div className="max-w-3xl">

          <div
            key={`badge-${currentSlide}`}
            className="inline-flex rounded-full border border-[#d9a85f]/60 bg-[#071d45]/40 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#e7c38a] backdrop-blur md:text-sm"
          >
            {slide.badge}
          </div>

          <h1
            key={`title-${currentSlide}`}
            className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:mt-7 md:text-6xl lg:text-7xl"
          >
            {slide.title}

            <span className="mt-2 block text-[#d9a85f]">
              {slide.highlight}
            </span>
          </h1>

          <p
            key={`description-${currentSlide}`}
            className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 md:mt-7 md:text-xl"
          >
            {slide.description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 md:mt-10">

            <a
              href={slide.buttonLink}
              className="inline-flex justify-center rounded-full bg-[#b07a32] px-6 py-3.5 text-center font-semibold text-white transition hover:bg-[#966526] sm:px-7"
            >
              {slide.buttonText}
            </a>

            <Link
              href="/account/register"
              className="inline-flex justify-center rounded-full border border-white/40 bg-white/5 px-6 py-3.5 text-center font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:px-7"
            >
              Create Your Account
            </Link>

          </div>

        </div>

      </div>

      {/* PREVIOUS BUTTON */}

      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#071d45]/50 text-lg text-white backdrop-blur transition hover:bg-[#071d45]/80 sm:left-4 sm:h-12 sm:w-12 sm:text-2xl md:left-8"
      >
        ←
      </button>

      {/* NEXT BUTTON */}

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#071d45]/50 text-lg text-white backdrop-blur transition hover:bg-[#071d45]/80 sm:right-4 sm:h-12 sm:w-12 sm:text-2xl md:right-8"
      >
        →
      </button>

      {/* SLIDE INDICATORS */}

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-10 sm:gap-3">

        {slides.map((item, index) => (
          <button
            key={item.image}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide
                ? "w-10 bg-[#d9a85f]"
                : "w-3 bg-white/50 hover:bg-white"
            }`}
          />
        ))}

      </div>

    </section>
  );
}