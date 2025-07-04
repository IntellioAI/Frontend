import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Calendar, Shield, Zap, MessageSquare, Diamond, TrendingUp, ExternalLink } from "lucide-react"

export default function PremiumVariant2() {
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
  ]

  return (
    <div className="min-h-screen bg-black ml-0 sm:ml-[80px] md:ml-[100px] lg:ml-[110px] xl:ml-[128px]">
      <div className="container mx-auto px-6 py-16">

        {/* Sophisticated Header */}
        <div className="relative w-full">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 bg-[url('/images/playground/playground_hero.webp')] bg-cover bg-center"
            style={{ filter: "blur(6px)" }}
          />

          {/* Dark semi-transparent overlay on top of blur */}
          <div className="absolute inset-0 bg-black/40 z-10" />

          {/* Actual content */}
          <div className="relative z-20 px-4 md:px-8 py-24 text-left">
            <div className="max-w-6xl">
              <div className="inline-flex items-center justify-start p-4 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm mb-6">
                <Diamond className="w-6 h-6 text-white mr-3" />
                <span className="text-white font-semibold">Premium SaaS Collection</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                Enterprise-Grade <br />
                <span className="bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent">
                  Solutions
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white max-w-3xl drop-shadow">
                Trusted by industry leaders worldwide. Each solution is crafted with precision and backed by
                enterprise-grade infrastructure.
              </p>
            </div>
          </div>
        </div>





        {/* Sophisticated Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => {
            const IconComponent = product.icon
            return (
              <Card
                key={product.id}
                className={`relative bg-black border ${product.popular ? "border-white/40 shadow-2xl shadow-white/5" : "border-white/20"
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
                    <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{product.subtitle}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">{product.description}</p>

                    {/* Elegant features */}
                    <div className="space-y-2 mb-6">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-300">
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
                          <span className="text-3xl font-bold text-white">{product.price}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{product.billing}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm font-semibold">
                      Start Trial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

      </div>
    </div>

  )
}
