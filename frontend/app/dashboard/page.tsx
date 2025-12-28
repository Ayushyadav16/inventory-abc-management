// app/dashboard/page.tsx - Professional Inventory Manager
"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Package,
  DollarSign,
  AlertTriangle,
  Skull,
  TrendingUp,
  BarChart3,
  Search,
  Edit2,
  Trash2,
  LogOut,
  LayoutDashboard,
  Box,
  ShoppingCart,
  MinusCircle,
  X,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  reorderPoint: number;
  supplier: string;
  location: string;
  abcCategory?: string;
  quantitySold?: number;
}

interface Analytics {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  lowStockItems: InventoryItem[];
  abcDistribution: { A: number; B: number; C: number };
  categoryDistribution: Record<string, number>;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory">(
    "dashboard"
  );
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [inventoryRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/api/inventory`),
        fetch(`${API_BASE}/api/analytics`),
      ]);

      const inventoryData = await inventoryRes.json();
      const analyticsData = await analyticsRes.json();

      setItems(inventoryData.items);
      setAnalytics(analyticsData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch(`${API_BASE}/api/inventory/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handlePurchase = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const calculateDeadStock = () => {
    return items.filter((item) => (item.quantitySold || 0) === 0).length;
  };

  const calculateTurnover = () => {
    const totalSold = items.reduce(
      (sum, item) => sum + (item.quantitySold || 0),
      0
    );
    const avgInventory =
      items.reduce((sum, item) => sum + item.quantity, 0) / items.length || 1;
    return (totalSold / avgInventory).toFixed(2);
  };

  const getABCPercentages = () => {
    const total =
      (analytics?.abcDistribution.A || 0) +
      (analytics?.abcDistribution.B || 0) +
      (analytics?.abcDistribution.C || 0);
    return {
      A: total
        ? Math.round(((analytics?.abcDistribution.A || 0) / total) * 100)
        : 0,
      B: total
        ? Math.round(((analytics?.abcDistribution.B || 0) / total) * 100)
        : 0,
      C: total
        ? Math.round(((analytics?.abcDistribution.C || 0) / total) * 100)
        : 0,
    };
  };

  const getTopAItems = () => {
    return items
      .filter((item) => item.abcCategory === "A")
      .sort((a, b) => b.quantity * b.unitPrice - a.quantity * a.unitPrice)
      .slice(0, 3);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All Categories" || item.category === filterCategory;
    const matchesClass =
      filterClass === "All Classes" || item.abcCategory === filterClass;
    return matchesSearch && matchesCategory && matchesClass;
  });

  const categories = [
    "All Categories",
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-700 text-xl font-semibold">
            Loading your inventory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Inventory Manager
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your stock efficiently
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                activeTab === "dashboard"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
              {activeTab === "dashboard" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                activeTab === "inventory"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Box size={20} />
              Inventory
              {activeTab === "inventory" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === "dashboard" ? (
          <DashboardView
            analytics={analytics}
            items={items}
            calculateDeadStock={calculateDeadStock}
            calculateTurnover={calculateTurnover}
            getABCPercentages={getABCPercentages}
            getTopAItems={getTopAItems}
          />
        ) : (
          <InventoryView
            items={filteredItems}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterClass={filterClass}
            setFilterClass={setFilterClass}
            categories={categories}
            deleteItem={deleteItem}
            handleEdit={handleEdit}
            handlePurchase={handlePurchase}
            setShowAddModal={setShowAddModal}
          />
        )}
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddItemModal
          onClose={() => {
            console.log("Closing add modal");
            setShowAddModal(false);
          }}
          onSuccess={() => {
            console.log("Add success");
            fetchData();
          }}
        />
      )}
      {showEditModal && selectedItem && (
        <EditItemModal
          item={selectedItem}
          onClose={() => {
            console.log("Closing edit modal");
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            console.log("Edit success");
            fetchData();
          }}
        />
      )}
      {showPurchaseModal && selectedItem && (
        <PurchaseModal
          item={selectedItem}
          onClose={() => {
            console.log("Closing purchase modal");
            setShowPurchaseModal(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            console.log("Purchase success");
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Dashboard View Component
function DashboardView({
  analytics,
  items,
  calculateDeadStock,
  calculateTurnover,
  getABCPercentages,
  getTopAItems,
}: any) {
  const abcPercentages = getABCPercentages();
  const topAItems = getTopAItems();
  const categoryData: [string, number][] = Object.entries(
    analytics?.categoryDistribution || {}
  ).map(([key, value]) => [key, value as number]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={analytics?.totalItems || 0}
          icon={<Package className="text-blue-600" size={28} />}
          gradient="from-blue-500 to-blue-600"
          bgGradient="from-blue-50 to-blue-100"
        />
        <StatCard
          title="Total Value"
          value={`$${(analytics?.totalValue || 0).toLocaleString()}`}
          icon={<DollarSign className="text-emerald-600" size={28} />}
          gradient="from-emerald-500 to-emerald-600"
          bgGradient="from-emerald-50 to-emerald-100"
        />
        <StatCard
          title="Low Stock"
          value={analytics?.lowStockCount || 0}
          subtitle="items need reorder"
          icon={<AlertTriangle className="text-amber-600" size={28} />}
          gradient="from-amber-500 to-amber-600"
          bgGradient="from-amber-50 to-amber-100"
        />
        <StatCard
          title="Dead Stock"
          value={calculateDeadStock()}
          subtitle="slow-moving items"
          icon={<Skull className="text-gray-600" size={28} />}
          gradient="from-gray-500 to-gray-600"
          bgGradient="from-gray-50 to-gray-100"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Turnover Ratio
              </h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {calculateTurnover()}x
              </p>
              <p className="text-sm text-gray-500 mt-1">
                inventory turns annually
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                ABC Distribution
              </h3>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {abcPercentages.A}%
                  </div>
                  <div className="text-xs text-gray-500">Class A</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {abcPercentages.B}%
                  </div>
                  <div className="text-xs text-gray-500">Class B</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {abcPercentages.C}%
                  </div>
                  <div className="text-xs text-gray-500">Class C</div>
                </div>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-yellow-100 rounded-2xl flex items-center justify-center">
              <BarChart3 className="text-green-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ABC Classification */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            ABC Classification
          </h3>
          <div className="flex items-center justify-center mb-6">
            <DonutChart percentages={abcPercentages} />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="font-semibold text-gray-900">Class A</span>
              </div>
              <span className="text-gray-600">High-value (70-80%)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                <span className="font-semibold text-gray-900">Class B</span>
              </div>
              <span className="text-gray-600">Medium-value (15-20%)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span className="font-semibold text-gray-900">Class C</span>
              </div>
              <span className="text-gray-600">Low-value (5-10%)</span>
            </div>
          </div>
        </div>

        {/* Items by Category */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            Items by Category
          </h3>
          <div className="space-y-5">
            {categoryData.map(([category, count]) => {
              const percentage = (
                (count / (analytics?.totalItems || 1)) *
                100
              ).toFixed(0);
              return (
                <div key={category} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {category}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {count} items
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-purple-700"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top High-Value Items */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          Top High-Value Items (Class A)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topAItems.map((item: any, index: number) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-bold text-blue-200">
                  #{index + 1}
                </span>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                  A
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">
                {item.name}
              </h4>
              <p className="text-sm text-gray-500 mb-4">{item.sku}</p>
              <div className="pt-4 border-t border-blue-200">
                <div className="text-2xl font-bold text-gray-900">
                  ${(item.quantity * item.unitPrice).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total Value</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inventory View Component
function InventoryView({
  items,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterClass,
  setFilterClass,
  categories,
  deleteItem,
  handleEdit,
  handlePurchase,
  setShowAddModal,
}: any) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search
              className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-600 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700 transition-all"
          >
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700 transition-all"
          >
            <option>All Classes</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold whitespace-nowrap"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 font-mono">{item.sku}</p>
              </div>
              <ABCBadge category={item.abcCategory || "C"} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                <div className="text-xs text-blue-600 font-medium mb-1">
                  Quantity
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {item.quantity}
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3">
                <div className="text-xs text-emerald-600 font-medium mb-1">
                  Price
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${item.unitPrice}
                </div>
              </div>
            </div>

            {/* Category & Status */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                {item.category}
              </span>
              <StatusBadge
                quantity={item.quantity}
                reorderPoint={item.reorderPoint}
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handlePurchase(item)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
              >
                <ShoppingCart size={16} />
                Sell
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-700 text-xl font-semibold mb-2">
            No items found
          </p>
          <p className="text-gray-500 mb-6">
            Try adjusting your filters or add a new item
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
          >
            <Plus className="inline mr-2" size={20} />
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ title, value, subtitle, icon, gradient, bgGradient }: any) {
  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-gray-700 font-semibold">{title}</div>
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md group-hover:scale-110 transition-transform`}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-600 font-medium">{subtitle}</div>
      )}
    </div>
  );
}

function DonutChart({ percentages }: any) {
  const total = percentages.A + percentages.B + percentages.C;
  const aAngle = (percentages.A / total) * 360;
  const bAngle = (percentages.B / total) * 360;

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="20"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#10B981"
          strokeWidth="20"
          strokeDasharray={`${(aAngle / 360) * 251.2} 251.2`}
          strokeDashoffset="0"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="20"
          strokeDasharray={`${(bAngle / 360) * 251.2} 251.2`}
          strokeDashoffset={`-${(aAngle / 360) * 251.2}`}
        />
      </svg>
    </div>
  );
}

function ABCBadge({ category }: { category: string }) {
  const styles = {
    A: "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50",
    B: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50",
    C: "bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/50",
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold ${
        styles[category as keyof typeof styles]
      }`}
    >
      {category}
    </span>
  );
}

function StatusBadge({ quantity, reorderPoint }: any) {
  if (quantity <= reorderPoint) {
    return (
      <span className="px-2 py-1 bg-red-500 text-white rounded-md text-xs font-bold animate-pulse">
        Low
      </span>
    );
  }
  return (
    <span className="px-2 py-1 bg-green-500 text-white rounded-md text-xs font-bold">
      Stock
    </span>
  );
}

// Add Item Modal
function AddItemModal({ onClose, onSuccess }: any) {
  const [formData, setFormData] = React.useState({
    name: "",
    sku: "",
    category: "Electronics",
    quantity: "",
    unitPrice: "",
    reorderPoint: "10",
    supplier: "",
    location: "Warehouse A",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          unitPrice: Number(formData.unitPrice),
          reorderPoint: Number(formData.reorderPoint),
        }),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Add New Item</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Dell XPS 15"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                placeholder="e.g., ELEC-001"
                required
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
            >
              <option>Electronics</option>
              <option>Furniture</option>
              <option>Office Supplies</option>
              <option>Cement</option>
              <option>Steel</option>
              <option>Tiles</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity *
              </label>
              <div className="relative">
                <Package
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  placeholder="100"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Price *
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  placeholder="999.99"
                  required
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, unitPrice: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reorder Point
              </label>
              <input
                type="number"
                placeholder="10"
                min="0"
                value={formData.reorderPoint}
                onChange={(e) =>
                  setFormData({ ...formData, reorderPoint: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                placeholder="Supplier name"
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all text-lg"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Item Modal
function EditItemModal({ item, onClose, onSuccess }: any) {
  const [formData, setFormData] = React.useState({
    name: item.name,
    sku: item.sku,
    category: item.category,
    quantity: item.quantity.toString(),
    unitPrice: item.unitPrice.toString(),
    reorderPoint: item.reorderPoint.toString(),
    supplier: item.supplier || "",
    location: item.location,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          unitPrice: Number(formData.unitPrice),
          reorderPoint: Number(formData.reorderPoint),
        }),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to update item. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Edit Item</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <div className="relative">
                <Package
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Price
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, unitPrice: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all"
            >
              Update Item
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Purchase/Sell Modal
function PurchaseModal({ item, onClose, onSuccess }: any) {
  const [quantity, setQuantity] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sellQty = Number(quantity);

    if (sellQty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (sellQty > item.quantity) {
      setError(`Only ${item.quantity} units available`);
      return;
    }

    try {
      await fetch(`${API_BASE}/api/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          quantity: item.quantity - sellQty,
          quantitySold: (item.quantitySold || 0) + sellQty,
        }),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to process sale:", error);
      setError("Failed to process sale");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Process Sale</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{item.sku}</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Available Stock</div>
              <div className="text-3xl font-bold text-gray-900">
                {item.quantity}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Unit Price</div>
              <div className="text-3xl font-bold text-gray-900">
                ${item.unitPrice}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity to Sell *
            </label>
            <div className="relative">
              <MinusCircle
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="number"
                placeholder="Enter quantity"
                required
                min="1"
                max={item.quantity}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError("");
                }}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          {quantity && Number(quantity) > 0 && (
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <div className="text-sm text-green-700 font-medium mb-1">
                Total Sale Value
              </div>
              <div className="text-3xl font-bold text-green-900">
                ${(Number(quantity) * item.unitPrice).toLocaleString()}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all"
            >
              Complete Sale
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
