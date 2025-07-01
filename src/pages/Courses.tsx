import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Star,
  BookOpen,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { isSlowDevice, useReducedMotion } from "../utils/deviceDetection";
import { useTheme } from "../context/useTheme";
import type { Course } from "../types";
import "./Courses.css"; // Import the CSS file with animations

const COURSES: Course[] = [
  {
    id: "cs-5",
    title: "Python Programming",
    description:
      "Learn Python from basics to advanced concepts with practical projects and applications.",
    instructor: "Dr. Maya Patel",
    thumbnail: "/images/courses/courses1.webp",
    duration: "12 weeks",
    level: "Beginner",
    category: "cs",
    rating: 4.9,
    students: 2800,
  },
  {
    id: "science-1",
    title: "Applied Physics",
    description:
      "Explore real-world applications of physics principles through experiments and simulations.",
    instructor: "Prof. Richard Feynman",
    thumbnail: "/images/courses/courses2.webp",
    duration: "14 weeks",
    level: "Intermediate",
    category: "science",
    rating: 4.7,
    students: 950,
  },
  {
    id: "math-1",
    title: "Mathematics 2",
    description:
      "Advanced mathematical concepts including calculus, linear algebra, and differential equations.",
    instructor: "Dr. Katherine Johnson",
    thumbnail: "/images/courses/courses3.webp",
    duration: "16 weeks",
    level: "Advanced",
    category: "math",
    rating: 4.8,
    students: 1100,
  },
] as const;

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const DURATIONS = [
  "All Durations",
  "8 weeks",
  "10 weeks",
  "12 weeks",
  "14 weeks",
  "16 weeks",
];
const CATEGORIES = [
  { value: "all", label: "All Courses" },
  { value: "cs", label: "Computer Science" },
  { value: "science", label: "Science" },
  { value: "math", label: "Mathematics" },
];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6; // Number of courses to display per page

  // Get theme context
  const { theme } = useTheme();

  // Use the proper React Hook at the component level
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setShouldReduceMotion(isSlowDevice() || prefersReducedMotion);
  }, [prefersReducedMotion]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedLevel !== "All Levels") count++;
    if (selectedDuration !== "All Durations") count++;
    setActiveFilters(count);
  }, [selectedCategory, selectedLevel, selectedDuration]);

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedLevel("All Levels");
    setSelectedDuration("All Durations");
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "All Levels" || course.level === selectedLevel;
      const matchesDuration =
        selectedDuration === "All Durations" ||
        course.duration === selectedDuration;
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return (
        matchesCategory && matchesLevel && matchesDuration && matchesSearch
      );
    });
  }, [selectedCategory, selectedLevel, selectedDuration, searchQuery]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Get current courses
  const currentCourses = useMemo(() => {
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    return filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  }, [filteredCourses, currentPage, coursesPerPage]);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    // Ensure page number is within valid range
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of courses section with smooth behavior
      document
        .getElementById("courses-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLevel, selectedDuration, searchQuery]);

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <section
        className="relative overflow-hidden pt-16 md:pt-24 pb-12 md:pb-16"
        style={{ background: "var(--header-bg)" }}
      >
        <div className="absolute inset-0 bg-[url('/images/courses/courses_hero.webp')] opacity-10 bg-cover bg-center"></div>
        {/* Static gradient background on mobile, animated on desktop */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center md:text-left max-w-3xl">
            <div
              className={`inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full ${
                theme === "dark"
                  ? "bg-indigo-500/30 border border-indigo-400/50 text-indigo-100"
                  : "bg-indigo-500/20 border border-indigo-400/30 text-indigo-700"
              } backdrop-blur-sm mb-4 md:mb-6 ${
                !shouldReduceMotion ? "animate-fade-in" : ""
              }`}
            >
              <span
                className={`flex h-2 w-2 rounded-full bg-indigo-300 ${
                  !shouldReduceMotion ? "animate-pulse" : ""
                } mr-2`}
              ></span>
              <span className="text-xs md:text-sm font-medium">
                Expert-led curriculum
              </span>
            </div>
            <h1
              className={`text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight ${
                !shouldReduceMotion ? "animate-fade-in animate-delay-100" : ""
              } drop-shadow-lg`}
            >
              Explore Our Courses
            </h1>
            <p
              className={`text-lg md:text-xl max-w-3xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } ${
                !shouldReduceMotion ? "animate-fade-in animate-delay-200" : ""
              }`}
            >
              Discover comprehensive courses designed to help you master new
              skills and advance your career.
            </p>
          </div>
        </div>
      </section>

      {/* Minimalistic Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 md:-mt-10 lg:-mt-8 relative z-10">
        <div
          className={`relative ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } border ${
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          } rounded-xl shadow-md overflow-hidden`}
        >
          {/* Minimalistic Search Form with Filter Toggle Button */}
          <div
            className={`relative flex-grow border-b ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex items-center h-14 md:h-16">
              <div className="pl-5 text-gray-500">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-full py-4 pl-3 pr-12 bg-transparent ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                } focus:outline-none focus:ring-0 border-0 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute right-14 md:right-16 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={toggleFilters}
                className={`flex items-center justify-center w-14 md:w-16 h-14 md:h-16 border-l ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                } ${
                  activeFilters > 0
                    ? "text-indigo-500"
                    : theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                } hover:text-gray-600 dark:hover:text-gray-300`}
                aria-label="Toggle filters"
              >
                {activeFilters > 0 && (
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    {activeFilters}
                  </span>
                )}
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Minimalistic Filter Dropdowns */}
          <div
            className={`overflow-hidden ${showFilters ? "block" : "hidden"}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {/* Category Filter */}
              <div
                className={`relative border-b sm:border-b-0 sm:border-r ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full h-14 md:h-16 appearance-none bg-transparent ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  } px-4 py-2 focus:outline-none cursor-pointer`}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Level Filter */}
              <div
                className={`relative border-b sm:border-b-0 sm:border-r ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className={`w-full h-14 md:h-16 appearance-none bg-transparent ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  } px-4 py-2 focus:outline-none cursor-pointer`}
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Duration Filter */}
              <div
                className={`relative border-b sm:border-b-0 ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className={`w-full h-14 md:h-16 appearance-none bg-transparent ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  } px-4 py-2 focus:outline-none cursor-pointer`}
                >
                  {DURATIONS.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalistic Filter Chips */}
        {/* Fixed Filter Chips Section with Consistent Layout and Spacing */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
            {selectedCategory !== "all" && (
              <div
                className={`inline-flex items-center h-10 px-3 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-100 border-gray-200"
                } border text-sm rounded-md`}
              >
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  } mr-2`}
                >
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
                </span>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none`}
                  aria-label={`Remove ${
                    CATEGORIES.find((c) => c.value === selectedCategory)?.label
                  } filter`}
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
            )}

            {selectedLevel !== "All Levels" && (
              <div
                className={`inline-flex items-center h-10 px-3 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-100 border-gray-200"
                } border text-sm rounded-md`}
              >
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  } mr-2`}
                >
                  {selectedLevel}
                </span>
                <button
                  onClick={() => setSelectedLevel("All Levels")}
                  className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none`}
                  aria-label={`Remove ${selectedLevel} filter`}
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
            )}

            {selectedDuration !== "All Durations" && (
              <div
                className={`inline-flex items-center h-10 px-3 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-100 border-gray-200"
                } border text-sm rounded-md`}
              >
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  } mr-2`}
                >
                  {selectedDuration}
                </span>
                <button
                  onClick={() => setSelectedDuration("All Durations")}
                  className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none`}
                  aria-label={`Remove ${selectedDuration} filter`}
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
            )}

            {/* Reset button with consistent styling */}
            <div
              onClick={resetFilters}
              className={`inline-flex items-center h-10 px-3 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-200"
              } border text-sm rounded-md cursor-pointer`}
            >
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                } mr-2`}
              >
                Reset
              </span>
              <X className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
        )}
      </div>
      {/* Course Grid */}
      <section
        id="courses-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16"
      >
        {filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentCourses.map((course, index) => {
              let categoryLabel;
              let categoryClass;

              switch (course.category) {
                case "cs":
                  categoryLabel = "Computer Science";
                  categoryClass = "bg-indigo-500/90";
                  break;
                case "science":
                  categoryLabel = "Science";
                  categoryClass = "bg-emerald-500/90";
                  break;
                case "math":
                  categoryLabel = "Mathematics";
                  categoryClass = "bg-violet-500/90";
                  break;
                default:
                  categoryLabel = "Course";
                  categoryClass = "bg-indigo-500/90";
              }

              // Determine if we should apply will-change based on viewport visibility
              // Only apply to first few visible cards for better performance
              const applyWillChange = index < 3;
              const isMobileDevice = isSlowDevice();
              const transitionDuration = isMobileDevice ? "200ms" : "300ms";

              return (
                <div
                  key={course.id}
                  className="group relative rounded-2xl overflow-hidden bg-black/70 backdrop-blur-sm md:backdrop-blur-xl border border-gray-800/50 md:hover:border-indigo-500/50 transition-colors shadow-md md:shadow-lg"
                  style={
                    applyWillChange && !isMobileDevice
                      ? { willChange: "transform, opacity" }
                      : undefined
                  }
                >
                  {/* Only render hover gradient on non-mobile devices */}
                  {!isMobileDevice && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <div className="relative">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className={`w-full h-full object-cover ${
                          !isMobileDevice
                            ? "transform group-hover:scale-105 transition-transform"
                            : ""
                        }`}
                        style={
                          !isMobileDevice ? { transitionDuration } : undefined
                        }
                        loading="lazy"
                        width="400"
                        height="225"
                        decoding="async"
                      />
                      {/* Simplified gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 ${categoryClass} text-white text-xs font-medium rounded-full`}
                        >
                          {categoryLabel}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2 py-1 bg-white/10 text-white text-xs font-medium rounded-full">
                          {course.level}
                        </span>
                        <span className="px-2 py-1 bg-white/10 text-white text-xs font-medium rounded-full">
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 md:p-6">
                      {/* Simplified tags for mobile */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-full">
                          {course.category.toUpperCase()}
                        </span>
                      </div>

                      <h3
                        className={`text-lg font-bold text-white mb-2 ${
                          !isMobileDevice
                            ? "group-hover:text-indigo-400 transition-colors"
                            : ""
                        }`}
                      >
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs mr-2">
                            {course.instructor.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white">
                              {course.instructor}
                            </div>
                            <div className="text-xs text-slate-400">
                              Instructor
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-white font-medium">
                            {course.rating}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({course.students})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div className="text-xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text">
                          ${Math.floor(Math.random() * 100) + 99}
                        </div>
                        <button
                          className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm rounded-lg ${
                            !isMobileDevice
                              ? "hover:from-indigo-700 hover:to-violet-700 transition-colors"
                              : ""
                          } font-semibold shadow-md`}
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Pagination - Modern and minimalistic design */}
        {totalPages > 1 && (
          <div className="mt-16 mb-2 flex justify-center px-4">
            <div className="relative w-full max-w-md">
              {/* Minimalistic pagination container */}
              <nav
                className="relative flex items-center justify-center space-x-1 sm:space-x-2"
                aria-label="Pagination"
                role="navigation"
              >
                {/* Previous button - Minimalist design */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full relative overflow-hidden touch-manipulation transition-all duration-300 ${
                    currentPage === 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-800/70 active:scale-95"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft
                    className={`h-5 w-5 ${
                      currentPage === 1 ? "text-gray-500" : "text-indigo-400"
                    }`}
                  />
                </button>

                {/* Pagination numbers with minimalist design */}
                <div
                  className="flex items-center overflow-x-auto hide-scrollbar py-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {/* First page button */}
                  {currentPage > 2 && (
                    <button
                      onClick={() => handlePageChange(1)}
                      className="w-8 h-8 mx-0.5 flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 hover:bg-gray-800/50"
                      aria-label="Page 1"
                    >
                      <span>1</span>
                    </button>
                  )}

                  {/* Minimalist ellipsis */}
                  {currentPage > 3 && (
                    <div className="w-8 h-8 mx-0.5 flex items-center justify-center">
                      <span className="text-gray-500 tracking-wider">···</span>
                    </div>
                  )}

                  {/* Page number buttons - Clean and minimal */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      // Show current page and pages nearby with improved logic for mobile
                      const isMobile = window.innerWidth < 640;
                      const visibleRange = isMobile ? 1 : 2;

                      if (
                        (pageNum === 1 && currentPage <= 3) || // Always show first page if we're near it
                        (pageNum === totalPages &&
                          currentPage >= totalPages - 2) || // Always show last page if we're near it
                        Math.abs(pageNum - currentPage) <= visibleRange // Show pages within range
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 mx-0.5 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                              currentPage === pageNum
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                            }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={
                              currentPage === pageNum ? "page" : undefined
                            }
                          >
                            <span>{pageNum}</span>
                          </button>
                        );
                      }
                      return null;
                    }
                  )}

                  {/* Minimalist ellipsis */}
                  {currentPage < totalPages - 2 && (
                    <div className="w-8 h-8 mx-0.5 flex items-center justify-center">
                      <span className="text-gray-500 tracking-wider">···</span>
                    </div>
                  )}

                  {/* Last page button */}
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-8 h-8 mx-0.5 flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 hover:bg-gray-800/50"
                      aria-label={`Page ${totalPages}`}
                    >
                      <span>{totalPages}</span>
                    </button>
                  )}
                </div>

                {/* Next button - Minimalist design */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full relative overflow-hidden touch-manipulation transition-all duration-300 ${
                    currentPage === totalPages
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-800/70 active:scale-95"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight
                    className={`h-5 w-5 ${
                      currentPage === totalPages
                        ? "text-gray-500"
                        : "text-indigo-400"
                    }`}
                  />
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* No results message */}
        {filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 mb-6 rounded-full bg-indigo-600/20 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-400 max-w-md">
              Try adjusting your search or filter criteria to find more courses.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedLevel("All Levels");
                setSelectedDuration("All Durations");
                setSearchQuery("");
              }}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
