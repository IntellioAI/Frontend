"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProductsSection from "./ProductsSection";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(255,255,255,${0.1 + i * 0.02})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full text-white"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.2 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function BackgroundPathsHero({ title = "Kokonut UI" }: { title?: string }) {
  const words = title.split(" ");

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-8 text-center max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter leading-tight">
            {words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="inline-block mr-3 sm:mr-4 last:mr-0"
              >
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="inline-block group relative bg-black rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative group inline-block transition-transform duration-300 hover:scale-105 rounded-[1.15rem]">
              {/* Gradient border wrapper (only appears on hover) */}
              <div className="absolute -inset-[2px] rounded-[1.15rem] bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

              {/* Actual button */}
              <Button
                variant="ghost"
                className="relative z-10 rounded-[1.15rem] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold backdrop-blur-md bg-black hover:bg-black/95 text-white transition-all duration-300 
      border-none outline-none ring-0 focus:outline-none focus:ring-0"
              >
                <span className="flex items-center transition-all duration-300 ease-in-out">
                  <span className="opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    Discover Excellence
                  </span>
                  <span className="ml-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ease-in-out">
                    →
                  </span>
                </span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
export default function Home() {
  const navigate = useNavigate();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const testimonialSliderRef = useRef<HTMLDivElement>(null);

  // Fix: Ensure page starts from top on load/refresh
  useEffect(() => {
    // Scroll to top immediately on component mount
    window.scrollTo(0, 0);

    // Prevent scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };

    const checkMotion = () => {
      setShouldReduceMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    checkMobile();
    checkMotion();

    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleTouchStart = () => {
    // Touch handling logic can be added here
  };

  const handleTouchMove = () => {
    // Touch handling logic can be added here
  };

  const handleTouchEnd = () => {
    // Touch handling logic can be added here
  };

  const testimonials = [
    {
      quote:
        "Intellio transformed my understanding of complex algorithms. The interactive labs make learning both fun and effective.",
      name: "Rahul Sharma",
      role: "CS Student, IIT Delhi",
      avatar: "/images/testimonials/user1.webp",
      color: "indigo",
    },
    {
      quote:
        "The AI-powered feedback helped me identify gaps in my knowledge. I've improved drastically in just 3 months.",
      name: "Priya Kapoor",
      role: "ECE Student, BITS Pilani",
      avatar: "/images/testimonials/user2.webp",
      color: "purple",
    },
    {
      quote:
        "The community support is amazing. I found study partners and mentors who helped me excel in my Products.",
      name: "Amit Verma",
      role: "ME Student, NIT Trichy",
      avatar: "/images/testimonials/user3.webp",
      color: "pink",
    },
    {
      quote:
        "The personalized learning path helped me focus on areas where I needed improvement. The results speak for themselves!",
      name: "Ananya Patel",
      role: "CSE Student, VIT Vellore",
      avatar: "/images/testimonials/user1.webp",
      color: "indigo",
    },
    {
      quote:
        "As someone who struggled with programming, Intellio.AI's step-by-step approach made complex concepts accessible.",
      name: "Vikram Singh",
      role: "IT Student, IIIT Hyderabad",
      avatar: "/images/testimonials/user2.webp",
      color: "purple",
    },
    {
      quote:
        "The practice problems and real-world projects helped me build a portfolio that impressed recruiters during my internship search.",
      name: "Neha Gupta",
      role: "ECE Student, DTU Delhi",
      avatar: "/images/testimonials/user3.webp",
      color: "pink",
    },
  ];

  const slidesPerView = isMobileDevice ? 1 : 3;
  const totalSlides = Math.ceil(testimonials.length / slidesPerView);
  const maxIndex = totalSlides - 1;

  return (
    <main className="w-full overflow-x-hidden">
      {/* Hero Section with Background Paths */}
      <BackgroundPathsHero title="Intelligent SaaS Platform" />
      <ProductsSection />

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-16 md:py-24 bg-black section-padding relative overflow-hidden"
        aria-labelledby="testimonials-heading"
      >
        {!isMobileDevice && (
          <>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animate-delay-2000"></div>
          </>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16 relative z-10">
            <h2
              id="testimonials-heading"
              className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-white"
            >
              What Our Students Say
            </h2>
            <p className="text-base md:text-xl text-indigo-200/80 max-w-2xl mx-auto">
              Join thousands of satisfied learners who've transformed their
              careers with our Products
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto px-0 sm:px-6">
            <div className="relative overflow-hidden rounded-lg bg-black/20 p-0 sm:p-4">
              <div
                ref={testimonialSliderRef}
                className="overflow-hidden relative rounded-lg"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{
                    transform: `translateX(-${currentTestimonialIndex * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className="min-w-full sm:min-w-[85%] md:min-w-[33.333%] px-0 sm:px-1 py-0 sm:py-1"
                    >
                      <div
                        className={`h-full bg-black/80 rounded-lg relative group overflow-hidden transition-all duration-300 ${
                          !isMobileDevice ? "hover:-translate-y-1" : ""
                        }`}
                      >
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 ${
                            testimonial.color === "indigo"
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-400"
                              : testimonial.color === "purple"
                              ? "bg-gradient-to-r from-purple-600 to-purple-400"
                              : "bg-gradient-to-r from-pink-600 to-pink-400"
                          }`}
                        ></div>
                        <div className="p-4 sm:p-6 h-full relative z-10">
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className="text-yellow-400 text-sm">★★★★★</div>
                            <span className="text-gray-500 text-sm ml-2">
                              5.0
                            </span>
                          </div>
                          <div className="mb-4 sm:mb-6">
                            <p className="text-white text-sm sm:text-base leading-relaxed">
                              "{testimonial.quote}"
                            </p>
                          </div>
                          <div className="flex items-center">
                            <img
                              src={testimonial.avatar}
                              alt={`${testimonial.name}'s profile picture`}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextElementSibling) {
                                  (
                                    e.currentTarget
                                      .nextElementSibling as HTMLElement
                                  ).style.display = "flex";
                                }
                              }}
                            />
                            <div
                              className="w-10 h-10 rounded-full mr-3 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold"
                              style={{ display: "none" }}
                            >
                              {testimonial.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white text-sm font-semibold">
                                {testimonial.name}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  setCurrentTestimonialIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentTestimonialIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-full flex items-center justify-center px-1 sm:px-2 ${
                  currentTestimonialIndex === 0
                    ? "opacity-0 cursor-default"
                    : "opacity-70 hover:opacity-100"
                } transition-opacity duration-300`}
                aria-label="Previous testimonials"
              >
                <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black/60 rounded text-white">
                  <ChevronLeft className="w-4 h-4" />
                </span>
              </button>

              <button
                onClick={() =>
                  setCurrentTestimonialIndex((prev) =>
                    Math.min(maxIndex, prev + 1)
                  )
                }
                disabled={currentTestimonialIndex === maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-full flex items-center justify-center px-1 sm:px-2 ${
                  currentTestimonialIndex === maxIndex
                    ? "opacity-0 cursor-default"
                    : "opacity-70 hover:opacity-100"
                } transition-opacity duration-300`}
                aria-label="Next testimonials"
              >
                <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black/60 rounded text-white">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            </div>

            {!isMobileDevice && (
              <div className="flex justify-center items-center mt-4 space-x-3">
                {Array.from({ length: totalSlides }, (_, pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => setCurrentTestimonialIndex(pageIndex)}
                    className={`${
                      currentTestimonialIndex === pageIndex
                        ? "w-4 bg-gradient-to-r from-indigo-600 to-violet-600"
                        : "w-1.5 bg-gray-700 hover:bg-gray-600"
                    }
                   h-1.5 rounded-full transition-all duration-300`}
                    aria-label={`Go to testimonial page ${pageIndex + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="py-20 md:py-28 bg-black relative overflow-hidden"
        aria-labelledby="cta-heading"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-950/10 via-violet-950/5 to-transparent pointer-events-none"
          aria-hidden="true"
        ></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white backdrop-blur-sm mb-6 -ml-1 ${
                !shouldReduceMotion ? "animate-fade-in" : ""
              }`}
            >
              <Diamond className="w-3.5 h-3.5 mr-2 text-white" />
              <span className="text-sm font-medium">
                Ready to unlock your potential?
              </span>
            </div>
            <h2
              id="cta-heading"
              className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl"
            >
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 md:mb-10">
              Join 50,000+ students mastering engineering with Intellio. Take
              the first step toward your dream career today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <button
                className="px-8 md:px-10 py-4 md:py-5 bg-white text-indigo-700 rounded-xl text-base md:text-lg font-bold hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
                aria-label="Start your free trial"
              >
                Start Free Trial
              </button>
              <div className="relative group inline-block rounded-xl transition-transform duration-300 hover:scale-105">
                {/* Gradient border layer (only on hover) */}
                <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

                {/* Actual button */}
                <button
                  onClick={() => navigate("/#")}
                  className="relative z-10 px-8 md:px-10 py-4 md:py-5 bg-black text-white border border-transparent rounded-xl text-base md:text-lg font-bold transition-all duration-300"
                  aria-label="Browse all Products"
                >
                  Premium Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-delay-2000 {
          animation-delay: 2s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .section-padding {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 640px) {
          .section-padding {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .section-padding {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        /* Prevent horizontal scrolling */
        body {
          overflow-x: hidden;
        }

        /* Fix for text visibility */
        html {
          scroll-behavior: smooth;
        }
        
        /* Ensure proper viewport handling */
        * {
          box-sizing: border-box;
        }
      `}</style>
    </main>
  );
}
