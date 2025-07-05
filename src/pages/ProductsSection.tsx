"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Grid3X3,
} from "lucide-react";

const products = [
  {
    id: "analytics-pro",
    name: "Analytics Pro",
    description:
      "Advanced business intelligence platform with AI-powered insights and real-time analytics.",
    icon: BarChart3,
    users: "25K+",
    features: [
      "AI-Powered Analytics",
      "Real-time Dashboards",
      "Custom Reports",
      "Predictive Intelligence",
    ],
    featured: true,
  },
  {
    id: "team-sync",
    name: "TeamSync",
    description:
      "Comprehensive collaboration platform with intelligent workflows and team management.",
    icon: Users,
    users: "18K+",
    features: [
      "Smart Workflows",
      "Team Analytics",
      "Project Management",
      "Communication Tools",
    ],
    featured: false,
  },
  {
    id: "secure-vault",
    name: "SecureVault",
    description:
      "Enterprise security suite with advanced threat detection and compliance management.",
    icon: Shield,
    users: "8K+",
    features: [
      "Threat Detection",
      "Security Monitoring",
      "Compliance Tools",
      "Access Control",
    ],
    featured: false,
  },
  {
    id: "automation-hub",
    name: "AutomationHub",
    description:
      "Intelligent process automation with visual workflow design and enterprise integrations.",
    icon: Zap,
    users: "12K+",
    features: [
      "Visual Workflows",
      "Smart Automation",
      "API Integration",
      "Process Analytics",
    ],
    featured: false,
  },
];

export default function VerticalPremiumThree() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white tracking-tight mb-4">
            Products
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Professional solutions crafted for modern, high-performing
            businesses
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 ">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card
                key={product.id}
                className="group relative transition-all duration-500 hover:-translate-y-2 bg-black border-white/20 hover:border-white/50 shadow-2xl hover:shadow-3xl backdrop-blur-sm"
              >
                {/* Featured Badge */}
                <CardContent
                  className="p-8 h-full flex flex-col"
                  style={{ minHeight: "420px" }}
                >
                  {/* Icon Section */}
                  <div className="mb-8">
                    <div className="w-14 h-14 rounded-xl bg-gray-950 border border-gray-900/50 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/10 transition-all duration-300">
                      <IconComponent className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-grow mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                      {product.description}
                    </p>

                    {/* Users Stats */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-900/50">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400 font-medium">
                        {product.users} users
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0 group-hover:bg-gray-500 transition-colors duration-300" />
                          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full h-12 font-medium transition-all duration-300 group/btn bg-white text-black hover:bg-gray-100 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center items-center">
          <div className="relative group inline-block rounded-xl transition-transform duration-300 hover:scale-105">
            {/* Gradient border layer (only on hover) */}
            <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

            {/* Actual button */}
            <Button
            onClick={() => window.location.href = "/products"}
              variant="outline"
              className="relative z-10 bg-black hover:bg-black text-white flex items-center gap-3 px-6 h-14 rounded-xl font-medium transition-all duration-300 border border-transparent"
            >
              <Grid3X3 className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-90" />
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
