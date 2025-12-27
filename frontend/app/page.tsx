// app/page.tsx - Home Page with Navigation
"use client";

import { useState } from "react";
import {
  Package,
  BarChart3,
  TrendingUp,
  Users,
  Warehouse,
  Settings,
  ArrowRight,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Insyd</h1>
                <p className="text-xs text-gray-500">AEC Solutions</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#solutions"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Solutions
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Pricing
              </a>
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Go to Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                New: AI-Powered Forecasting
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Inventory Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Thoughtfully Built
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your construction material business with intelligent
              inventory tracking, ABC analysis, and real-time insights designed
              for Indian AEC businesses.
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-purple-600 hover:text-purple-600 transition-all"
              >
                Explore Features
              </a>
            </div>
            <div className="mt-8 flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Happy Businesses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">₹50Cr+</div>
                <div className="text-sm text-gray-500">Inventory Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop"
                alt="Warehouse"
                className="rounded-xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-xl">
                <div className="text-3xl font-bold">25%</div>
                <div className="text-sm">Avg. Cost Reduction</div>
              </div>
            </div>
            <div className="absolute top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for construction material businesses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 size={32} />}
              title="ABC Analysis"
              description="Automatically categorize inventory by revenue contribution. Focus on what matters most."
              color="from-red-500 to-pink-500"
              link="/dashboard"
            />
            <FeatureCard
              icon={<TrendingUp size={32} />}
              title="Real-Time Tracking"
              description="Monitor stock levels across multiple locations with live updates and alerts."
              color="from-blue-500 to-cyan-500"
              link="/dashboard"
            />
            <FeatureCard
              icon={<Zap size={32} />}
              title="Smart Alerts"
              description="Never run out of stock. Get intelligent notifications before it's too late."
              color="from-yellow-500 to-orange-500"
              link="/dashboard"
            />
            <FeatureCard
              icon={<Warehouse size={32} />}
              title="Multi-Location"
              description="Manage inventory across warehouses, sites, and retail locations seamlessly."
              color="from-purple-500 to-indigo-500"
              link="/dashboard"
            />
            <FeatureCard
              icon={<Target size={32} />}
              title="Demand Forecasting"
              description="Predict future demand using historical data and seasonal patterns."
              color="from-green-500 to-emerald-500"
              link="/dashboard"
            />
            <FeatureCard
              icon={<Shield size={32} />}
              title="Quality Tracking"
              description="Monitor damage, returns, and quality issues with detailed logs and photos."
              color="from-indigo-500 to-purple-500"
              link="/dashboard"
            />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section
        id="solutions"
        className="py-20 bg-gradient-to-br from-purple-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for AEC Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Solutions tailored to your industry needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SolutionCard
              title="Material Distributors"
              description="Manage thousands of SKUs across cement, steel, tiles, and more. Reduce dead stock by 30%."
              features={[
                "Multi-location tracking",
                "Supplier management",
                "Bulk order processing",
              ]}
              image="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop"
              link="/dashboard"
            />
            <SolutionCard
              title="Construction Companies"
              description="Track materials across multiple project sites. Ensure materials arrive when needed."
              features={[
                "Project-based tracking",
                "Site inventory",
                "Cost allocation",
              ]}
              image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop"
              link="/dashboard"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join 500+ businesses already saving time and money with Insyd
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Start Free Trial
          </Link>
          <p className="text-purple-100 mt-4 text-sm">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-purple-400" size={24} />
                <span className="text-white font-bold text-xl">Insyd</span>
              </div>
              <p className="text-sm">
                Empowering AEC businesses with intelligent inventory management.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 Insyd AEC Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, link }: any) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-gray-100">
        <div
          className={`w-16 h-16 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white mb-6`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="mt-4 flex items-center text-purple-600 font-semibold">
          Learn more <ArrowRight className="ml-2" size={16} />
        </div>
      </div>
    </Link>
  );
}

function SolutionCard({ title, description, features, image, link }: any) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          <ul className="space-y-2 mb-6">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex items-center text-purple-600 font-semibold">
            Explore solution <ArrowRight className="ml-2" size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
