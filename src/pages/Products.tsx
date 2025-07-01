import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Star,
  Layers,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Code,
  Users,
  Bot,
  Activity,
  Linkedin,
} from "lucide-react";
import { isSlowDevice, useReducedMotion } from "../utils/deviceDetection";
import { useTheme } from "../context/useTheme";
import "./Products.css"; // Import the CSS file with animations

const PRODUCTS = [
  {
    id: "code-playground",
    title: "Code Playground",
    description:
      "Interactive coding environment with real-time collaboration, syntax highlighting, and multi-language support.",
    category: "development",
    thumbnail: "/images/products/code-playground.webp",
    pricing: "Free",
    tier: "Free",
    rating: 4.9,
    users: 15000,
    features: ["Real-time collaboration", "Multi-language support", "Live preview", "Version control"],
    icon: Code,
  },
  {
    id: "faculty-dashboard",
    title: "Faculty Dashboard",
    description:
      "Comprehensive analytics and management platform for educational institutions and faculty members.",
    category: "education",
    thumbnail: "/images/products/faculty-dashboard.webp",
    pricing: "$29/month",
    tier: "Pro",
    rating: 4.8,
    users: 2800,
    features: ["Student analytics", "Grade management", "Progress tracking", "Reporting tools"],
    icon: Users,
  },
  {
    id: "digital-clone",
    title: "Digital Clone",
    description:
      "AI-powered digital twin technology for creating intelligent virtual representations and interactions.",
    category: "ai",
    thumbnail: "/images/products/digital-clone.webp",
    pricing: "$99/month",
    tier: "Enterprise",
    rating: 4.7,
    users: 950,
    features: ["AI personality modeling", "Voice synthesis", "Behavioral patterns", "Custom training"],
    icon: Bot,
  },
  {
    id: "pulse",
    title: "Pulse",
    description:
      "Real-time monitoring and analytics platform for tracking system performance and user engagement.",
    category: "analytics",
    thumbnail: "/images/products/pulse.webp",
    pricing: "$49/month",
    tier: "Pro",
    rating: 4.8,
    users: 1100,
    features: ["Real-time monitoring", "Custom dashboards", "Alert system", "Performance metrics"],
    icon: Activity,
  },
  {
    id: "linkedin-automation",
    title: "LinkedIn Automation",
    description:
      "Intelligent automation tools for LinkedIn networking, lead generation, and professional growth.",
    category: "automation",
    thumbnail: "/images/products/linkedin-automation.webp",
    pricing: "$79/month",
    tier: "Pro",
    rating: 4.6,
    users: 3200,
    features: ["Auto messaging", "Lead generation", "Connection management", "Analytics dashboard"],
    icon: Linkedin,
  },
] as const;

const TIERS = ["All Tiers", "Free", "Pro", "Enterprise"];
const PRICING_RANGES = [
  "All Pricing",
  "Free",
  "$1-50/month",
  "$51-100/month",
  "$100+/month",
];
const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "development", label: "Development" },
  { value: "education", label: "Education" },
  { value: "ai", label: "AI & Machine Learning" },
  { value: "analytics", label: "Analytics" },
  { value: "automation", label: "Automation" },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState("All Tiers");
  const [selectedPricing, setSelectedPricing] = useState("All Pricing");
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Number of products to display per page

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
    if (selectedTier !== "All Tiers") count++;
    if (selectedPricing !== "All Pricing") count++;
    setActiveFilters(count);
  }, [selectedCategory, selectedTier, selectedPricing]);

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedTier("All Tiers");
    setSelectedPricing("All Pricing");
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Helper function to check pricing range
  const matchesPricingRange = (productPricing: string, selectedRange: string) => {
    if (selectedRange === "All Pricing") return true;
    if (selectedRange === "Free") return productPricing === "Free";
    if (selectedRange === "$1-50/month") {
      const price = parseInt(productPricing.replace(/[^\d]/g, ''));
      return price >= 1 && price <= 50;
    }
    if (selectedRange === "$51-100/month") {
      const price = parseInt(productPricing.replace(/[^\d]/g, ''));
      return price >= 51 && price <= 100;
    }
    if (selectedRange === "$100+/month") {
      const price = parseInt(productPricing.replace(/[^\d]/g, ''));
      return price > 100;
    }
    return false;
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesTier =
        selectedTier === "All Tiers" || product.tier === selectedTier;
      const matchesPricing = matchesPricingRange(product.pricing, selectedPricing);
      const matchesSearch: boolean =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.features.some((feature: string) => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return (
        matchesCategory && matchesTier && matchesPricing && matchesSearch
      );
    });
  }, [selectedCategory, selectedTier, selectedPricing, searchQuery]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get current products
  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage, productsPerPage]);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    // Ensure page number is within valid range
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of products section with smooth behavior
      document
        .getElementById("products-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTier, selectedPricing, searchQuery]);

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
        <div className="absolute inset-0 bg-[url('/images/products/products_hero.webp')] opacity-10 bg-cover bg-center"></div>
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
                Innovation-driven solutions
              </span>
            </div>
            <h1
              className={`text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight ${
                !shouldReduceMotion ? "animate-fade-in animate-delay-100" : ""
              } drop-shadow-lg`}
            >
              Explore Our Products
            </h1>
            <p
              className={`text-lg md:text-xl max-w-3xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } ${
                !shouldReduceMotion ? "animate-fade-in animate-delay-200" : ""
              }`}
            >
              Discover cutting-edge products designed to enhance productivity,
              streamline workflows, and drive innovation across industries.
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
                placeholder="Search for products..."
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

              {/* Tier Filter */}
              <div
                className={`relative border-b sm:border-b-0 sm:border-r ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className={`w-full h-14 md:h-16 appearance-none bg-transparent ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  } px-4 py-2 focus:outline-none cursor-pointer`}
                >
                  {TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Pricing Filter */}
              <div
                className={`relative border-b sm:border-b-0 ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <select
                  value={selectedPricing}
                  onChange={(e) => setSelectedPricing(e.target.value)}
                  className={`w-full h-14 md:h-16 appearance-none bg-transparent ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  } px-4 py-2 focus:outline-none cursor-pointer`}
                >
                  {PRICING_RANGES.map((pricing) => (
                    <option key={pricing} value={pricing}>
                      {pricing}
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

            {selectedTier !== "All Tiers" && (
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
                  {selectedTier}
                </span>
                <button
                  onClick={() => setSelectedTier("All Tiers")}
                  className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none`}
                  aria-label={`Remove ${selectedTier} filter`}
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
            )}

            {selectedPricing !== "All Pricing" && (
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
                  {selectedPricing}
                </span>
                <button
                  onClick={() => setSelectedPricing("All Pricing")}
                  className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none`}
                  aria-label={`Remove ${selectedPricing} filter`}
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

      {/* Product Grid */}
      <section
        id="products-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16"
      >
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentProducts.map((product, index) => {
              let categoryLabel;
              let categoryClass;

              switch (product.category) {
                case "development":
                  categoryLabel = "Development";
                  categoryClass = "bg-indigo-500/90";
                  break;
                case "education":
                  categoryLabel = "Education";
                  categoryClass = "bg-emerald-500/90";
                  break;
                case "ai":
                  categoryLabel = "AI & ML";
                  categoryClass = "bg-violet-500/90";
                  break;
                case "analytics":
                  categoryLabel = "Analytics";
                  categoryClass = "bg-orange-500/90";
                  break;
                case "automation":
                  categoryLabel = "Automation";
                  categoryClass = "bg-blue-500/90";
                  break;
                default:
                  categoryLabel = "Product";
                  categoryClass = "bg-indigo-500/90";
              }

              // Determine if we should apply will-change based on viewport visibility
              // Only apply to first few visible cards for better performance
              const applyWillChange = index < 3;
              const isMobileDevice = isSlowDevice();
              const transitionDuration = isMobileDevice ? "200ms" : "300ms";
              const IconComponent = product.icon;

              return (
                <div
                  key={product.id}
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
                        src={product.thumbnail}
                        alt={product.title}
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
                          {product.tier}
                        </span>
                        <span className="px-2 py-1 bg-white/10 text-white text-xs font-medium rounded-full">
                          {product.pricing}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 md:p-6">
                      {/* Product icon and title */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <h3
                          className={`text-lg font-bold text-white ${
                            !isMobileDevice
                              ? "group-hover:text-indigo-400 transition-colors"
                              : ""
                          }`}
                        >
                          {product.title}
                        </h3>
                      </div>

                      <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Features list */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 3).map((feature: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                          {product.features.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full">
                              +{product.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-white font-medium">
                            {product.rating}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({product.users.toLocaleString()} users)
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text">
                            {product.pricing}
                          </div>
                          <div className="text-xs text-slate-400">{product.tier}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <button
                          className={`flex-1 mr-2 px-4 py-2 bg-gray-700/50 text-white text-sm rounded-lg ${
                            !isMobileDevice
                              ? "hover:bg-gray-600/50 transition-colors"
                              : ""
                          } font-medium`}
                        >
                          Learn More
                        </button>
                        <button
                          className={`flex-1 ml-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm rounded-lg ${
                            !isMobileDevice
                              ? "hover:from-indigo-700 hover:to-violet-700 transition-colors"
                              : ""
                          } font-semibold shadow-md`}
                        >
                          {product.pricing === "Free" ? "Get Started" : "Try Free"}
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
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 mb-6 rounded-full bg-indigo-600/20 flex items-center justify-center">
              <Layers className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-400 max-w-md">
              Try adjusting your search or filter criteria to find more products.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedTier("All Tiers");
                setSelectedPricing("All Pricing");
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