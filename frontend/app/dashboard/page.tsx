// app/dashboard/page.tsx - Dashboard with Tab Navigation
"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Inventory Manager
              </h1>
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === "dashboard"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === "inventory"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Box size={20} />
              <span className="font-medium">Inventory</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-[1400px] mx-auto">
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
            setShowAddModal={setShowAddModal}
          />
        )}
      </main>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
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
          icon={<Package className="text-blue-600" size={24} />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Total Value"
          value={`$${(analytics?.totalValue || 0).toLocaleString()}`}
          icon={<DollarSign className="text-green-600" size={24} />}
          iconBg="bg-green-50"
        />
        <StatCard
          title="Low Stock"
          value={analytics?.lowStockCount || 0}
          subtitle="items need reorder"
          icon={<AlertTriangle className="text-yellow-600" size={24} />}
          iconBg="bg-yellow-50"
        />
        <StatCard
          title="Dead Stock"
          value={calculateDeadStock()}
          subtitle="slow-moving items"
          icon={<Skull className="text-gray-600" size={24} />}
          iconBg="bg-gray-50"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Turnover Ratio"
          value={`${calculateTurnover()}x`}
          subtitle="inventory turns"
          icon={<TrendingUp className="text-blue-600" size={24} />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="ABC Split"
          value={
            <div className="flex items-center gap-3 mt-2">
              <span className="text-green-600 font-semibold">
                A:{abcPercentages.A}
              </span>
              <span className="text-yellow-600 font-semibold">
                B:{abcPercentages.B}
              </span>
              <span className="text-gray-600 font-semibold">
                C:{abcPercentages.C}
              </span>
            </div>
          }
          icon={<BarChart3 className="text-blue-600" size={24} />}
          iconBg="bg-blue-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ABC Classification */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            ABC Classification
          </h3>
          <div className="flex items-center justify-center mb-6">
            <DonutChart percentages={abcPercentages} />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-600">A:</span>
              <span className="text-gray-600">
                High-value items (70-80% of value)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-yellow-600">B:</span>
              <span className="text-gray-600">
                Medium-value items (15-20% of value)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">C:</span>
              <span className="text-gray-600">
                Low-value items (5-10% of value)
              </span>
            </div>
          </div>
        </div>

        {/* Items by Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Items by Category
          </h3>
          <div className="space-y-4">
            {categoryData.map(([category, count], index) => (
              <div key={category}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">{category}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(count / (analytics?.totalItems || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top High-Value Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top High-Value Items (Class A)
        </h3>
        <div className="space-y-4">
          {topAItems.map((item: any, index: number) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300">
                  {index + 1}
                </span>
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.sku}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${(item.quantity * item.unitPrice).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">consumption value</div>
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
  setShowAddModal,
}: any) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option>All Classes</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Package size={20} className="text-gray-600" />
          <span className="font-semibold text-gray-900">Inventory Items</span>
          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm font-medium">
            {items.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ABC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${item.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <ABCBadge category={item.abcCategory || "C"} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      quantity={item.quantity}
                      reorderPoint={item.reorderPoint}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg font-medium">No items found</p>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters or add a new item
          </p>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ title, value, subtitle, icon, iconBg }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-gray-600 font-medium">{title}</div>
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </div>
  );
}

function DonutChart({ percentages }: any) {
  const total = percentages.A + percentages.B + percentages.C;
  const aAngle = (percentages.A / total) * 360;
  const bAngle = (percentages.B / total) * 360;

  return (
    <div className="relative w-64 h-64">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#9CA3AF"
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs text-gray-500 mb-1">
          Class A ({percentages.A}%)
        </div>
        <div className="text-xs text-gray-500 mb-1">
          Class B ({percentages.B}%)
        </div>
        <div className="text-xs text-gray-500">Class C ({percentages.C}%)</div>
      </div>
    </div>
  );
}

function ABCBadge({ category }: { category: string }) {
  const styles = {
    A: "bg-green-600 text-white",
    B: "bg-yellow-500 text-white",
    C: "bg-gray-400 text-white",
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
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
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
        Low Stock
      </span>
    );
  }
  return (
    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
      In Stock
    </span>
  );
}

function AddItemModal({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Electronics",
    quantity: 0,
    unitPrice: 0,
    reorderPoint: 10,
    supplier: "",
    location: "Warehouse A",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="SKU"
            required
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Office Supplies</option>
            <option>Cement</option>
            <option>Steel</option>
            <option>Tiles</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Quantity"
              required
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              required
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: Number(e.target.value) })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="text"
            placeholder="Supplier"
            value={formData.supplier}
            onChange={(e) =>
              setFormData({ ...formData, supplier: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
