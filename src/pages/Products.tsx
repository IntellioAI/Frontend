import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Calendar,
  Shield,
  Zap,
  MessageSquare,
  Diamond,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function PremiumVariant2() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    // Add listener for changes
    const handleChange = (e: MediaQueryListEvent) =>
      setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  const products = [
    {
      id: 1,
      name: "Analytics Pro",
      subtitle: "Business Intelligence Suite",
      description: "Advanced analytics platform with AI-powered insights",
      icon: BarChart3,
      price: "$29",
      billing: "per user/month",
      features: ["Real-time Analytics", "Custom Dashboards", "API Access"],
      metrics: { users: "10K+", rating: 4.9, growth: "+127%" },
      popular: false,
      category: "Analytics",
    },
    {
      id: 2,
      name: "CRM Suite",
      subtitle: "Customer Success Platform",
      description: "Complete CRM solution with automation",
      icon: Users,
      price: "$49",
      billing: "per user/month",
      features: ["Contact Management", "Sales Pipeline", "Email Integration"],
      metrics: { users: "25K+", rating: 4.8, growth: "+89%" },
      popular: false,
      category: "Sales",
    },
    {
      id: 3,
      name: "Project Hub",
      subtitle: "Team Collaboration Suite",
      description: "Project management with team productivity tools",
      icon: Calendar,
      price: "$39",
      billing: "per team/month",
      features: ["Task Management", "Team Collaboration", "Time Tracking"],
      metrics: { users: "15K+", rating: 4.7, growth: "+156%" },
      popular: false,
      category: "Productivity",
    },
    {
      id: 4,
      name: "SecureVault",
      subtitle: "Enterprise Security Platform",
      description: "Military-grade security and compliance",
      icon: Shield,
      price: "$79",
      billing: "per organization/month",
      features: ["Data Encryption", "Access Control", "Compliance Reports"],
      metrics: { users: "5K+", rating: 5.0, growth: "+203%" },
      popular: false,
      category: "Security",
    },
    {
      id: 5,
      name: "AutoFlow",
      subtitle: "Intelligent Automation",
      description: "Smart workflow automation with ML",
      icon: Zap,
      price: "$59",
      billing: "per workflow/month",
      features: ["Workflow Builder", "API Integrations", "Smart Triggers"],
      metrics: { users: "8K+", rating: 4.9, growth: "+178%" },
      popular: false,
      category: "Automation",
    },
    {
      id: 6,
      name: "ChatConnect",
      subtitle: "Customer Experience Platform",
      description: "AI-powered customer support solution",
      icon: MessageSquare,
      price: "$35",
      billing: "per agent/month",
      features: ["Live Chat", "AI Chatbot", "Multi-channel Support"],
      metrics: { users: "12K+", rating: 4.6, growth: "+134%" },
      popular: false,
      category: "Support",
    },
  ];

  return (
    <main
      className="min-h-screen bg-black flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header Section */}
      <section
        className="relative overflow-hidden pt-16 lg:pt-8 pb-100 lg:pb-8"
        style={{ background: "var(--header-bg)" }}
      >
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('/images/playground/playground_hero.webp')] opacity-10 bg-cover bg-center"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center md:text-left max-w-3xl">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white backdrop-blur-sm mb-6 -ml-1 ${
                !shouldReduceMotion ? "animate-fade-in" : ""
              }`}
            >
              <Diamond className="w-3.5 h-3.5 mr-2 text-white" />
              <span className="text-sm font-medium">
                Premium SaaS Collection
              </span>
            </div>

            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight ${
                !shouldReduceMotion ? "animate-fade-in animate-delay-100" : ""
              } drop-shadow-lg`}
            >
              Enterprise-Grade Solutions
            </h1>

            <p
              className={`text-lg md:text-xl text-indigo-200/80 max-w-3xl ${
                !shouldReduceMotion ? "animate-fade-in animate-delay-200" : ""
              }`}
            >
              Trusted by industry leaders worldwide. Each solution is crafted
              with precision and backed by enterprise-grade infrastructure.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-12">
        {/* Sophisticated Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card
                key={product.id}
                className={`relative bg-black border ${
                  product.popular
                    ? "border-white/40 shadow-2xl shadow-white/5"
                    : "border-white/20"
                } hover:border-white/60 transition-all duration-300 group overflow-hidden`}
              >
                {/* Sophisticated popular indicator */}
                {product.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                )}

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <CardContent className="p-8 relative">
                  {/* Header with metrics */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <Badge className="bg-white/10 text-white border-white/20 text-xs mb-2 w-fit">
                          {product.category}
                        </Badge>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span>{product.metrics.users} users</span>
                          <span>•</span>
                          <span>★ {product.metrics.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-green-400 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {product.metrics.growth}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {product.subtitle}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Elegant features */}
                    <div className="space-y-2 mb-6">
                      {product.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sophisticated pricing */}
                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-white">
                            {product.price}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {product.billing}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-blue-400 hover:bg-black p-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm font-semibold">
                      Start Trial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
