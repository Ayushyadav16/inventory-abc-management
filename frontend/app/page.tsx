import React from "react";
import {
  Package,
  BarChart3,
  TrendingUp,
  Bell,
  Database,
  Target,
  Shield,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Zap,
  Layers,
  RefreshCw,
  Eye,
  Cloud,
} from "lucide-react";
import Link from "next/link";

export default function EnterpriseInventoryUI() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30">
      {/* Navigation */}
      <header className="border-b border-blue-100/50 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Package className="text-white" size={22} />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Insyd
                </span>
                <p className="text-xs text-gray-500 font-medium">
                  Inventory Intelligence
                </p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/dashboard">Launch Dashboard</Link>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-28 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-semibold mb-8">
              <Zap className="text-purple-600" size={16} />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Now with AI-powered forecasting
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Enterprise Inventory
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Management Platform
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Optimize inventory operations with real-time tracking, intelligent
              analytics, and automated workflows designed for scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <span>Start Free Trial</span>
                <ArrowRight
                  className="ml-3 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                View Documentation
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-gray-600">
              {[
                {
                  icon: <CheckCircle2 className="text-emerald-500" size={18} />,
                  text: "No credit card required",
                },
                {
                  icon: <CheckCircle2 className="text-emerald-500" size={18} />,
                  text: "14-day free trial",
                },
                {
                  icon: <CheckCircle2 className="text-emerald-500" size={18} />,
                  text: "Full feature access",
                },
                {
                  icon: <CheckCircle2 className="text-emerald-500" size={18} />,
                  text: "24/7 support",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-y border-blue-100/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                value: "500+",
                label: "Active Deployments",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                value: "₹50Cr+",
                label: "Inventory Managed",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                value: "99.9%",
                label: "Platform Uptime",
                gradient: "from-emerald-500 to-green-500",
              },
            ].map((stat, idx) => (
              <div key={idx} className="text-center md:text-left group">
                <div
                  className={`text-5xl font-bold mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
                <div
                  className={`mt-4 w-12 h-1 bg-gradient-to-r ${stat.gradient} rounded-full group-hover:w-16 transition-all duration-300`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16 text-center mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Enterprise Scale
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools to manage, track, and optimize inventory
              operations across your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="ABC Analysis"
              description="Automated classification and prioritization of inventory items by value contribution."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<TrendingUp size={24} />}
              title="Real-time Tracking"
              description="Monitor stock levels, movements, and transactions with live updates across all locations."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<Bell size={24} />}
              title="Smart Alerts"
              description="Configurable notifications for stock thresholds, expiration dates, and anomaly detection."
              gradient="from-amber-500 to-orange-500"
            />
            <FeatureCard
              icon={<Layers size={24} />}
              title="Multi-location Support"
              description="Centralized management of inventory across warehouses, distribution centers, and retail."
              gradient="from-emerald-500 to-green-500"
            />
            <FeatureCard
              icon={<Target size={24} />}
              title="Demand Forecasting"
              description="ML-powered predictions based on historical data, seasonality, and market trends."
              gradient="from-indigo-500 to-blue-500"
            />
            <FeatureCard
              icon={<Shield size={24} />}
              title="Quality Assurance"
              description="Integrated workflows for inspection, compliance tracking, and quality control."
              gradient="from-rose-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Seamless Integration
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Connect Insyd with your ERP, accounting software, and business
                intelligence platforms through our comprehensive API.
              </p>
              <ul className="space-y-4">
                {[
                  "RESTful API with comprehensive documentation",
                  "Webhook support for real-time event notifications",
                  "Pre-built connectors for popular platforms",
                  "Custom integration support for enterprise clients",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="inline-flex items-center gap-3 mt-8 px-6 py-3 bg-white border-2 border-blue-100 text-blue-600 font-semibold rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                View API Documentation
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
              <div className="space-y-4">
                {[
                  {
                    icon: <Database size={22} />,
                    name: "SAP Integration",
                    status: "Connected",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: <RefreshCw size={22} />,
                    name: "QuickBooks",
                    status: "Syncing data",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: <Eye size={22} />,
                    name: "Power BI",
                    status: "Active",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: <Cloud size={22} />,
                    name: "Salesforce",
                    status: "Connected",
                    color: "from-amber-500 to-orange-500",
                  },
                ].map((integration, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${integration.color} rounded-xl flex items-center justify-center shadow-md`}
                    >
                      <div className="text-white">{integration.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {integration.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {integration.status}
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 bg-gradient-to-r ${integration.color} rounded-full`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Optimize Your Inventory?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Start your free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-blue-600 bg-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <span>Start Free Trial</span>
                <ArrowRight
                  className="ml-3 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>
              <button className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white bg-transparent border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300">
                Schedule a Demo
              </button>
            </div>
            <p className="text-blue-100/80 mt-8 text-sm">
              Complete access • No setup fees • 14-day trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100/50 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Insyd</h3>
                <p className="text-sm text-gray-600">
                  Inventory Intelligence Platform
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">
                © 2025 Insyd. All rights reserved.
              </p>
              <p className="text-xs text-gray-500">
                Designed for modern enterprise inventory management
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: any) {
  return (
    <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300">
      <div
        className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-6 w-8 h-1 bg-gradient-to-r from-gray-200 to-gray-200 group-hover:from-blue-500 group-hover:to-purple-500 rounded-full transition-all duration-300" />
    </div>
  );
}
