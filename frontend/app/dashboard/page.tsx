"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Package,
  AlertTriangle,
  TrendingUp,
  Search,
  X,
  Edit2,
  Trash2,
  BarChart3,
  Warehouse,
  DollarSign,
  ShoppingCart,
  Activity,
  Home,
} from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ===================== TYPES ===================== */

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
  abcCategory: "A" | "B" | "C";
  quantitySold?: number;
}

interface Analytics {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  abcDistribution: { A: number; B: number; C: number };
  categoryDistribution: Record<string, number>;
}

/* ===================== PAGE ===================== */

export default function DashboardPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = [
    "All",
    "Cement",
    "Steel",
    "Tiles",
    "Paint",
    "Plumbing",
    "Electrical",
    "Hardware",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, anaRes] = await Promise.all([
        fetch(`${API_BASE}/api/inventory`),
        fetch(`${API_BASE}/api/analytics`),
      ]);

      const invData = await invRes.json();
      const anaData = await anaRes.json();

      setItems(invData.items);
      setAnalytics(anaData);
    } catch (err) {
      alert("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`${API_BASE}/api/inventory/${id}`, { method: "DELETE" });
    fetchData();
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        filterCategory === "All" || item.category === filterCategory;

      return matchSearch && matchCategory;
    });
  }, [items, searchTerm, filterCategory]);

  const calculateTurnover = () => {
    if (items.length === 0) return "0.0";
    const sold = items.reduce((sum, i) => sum + (i.quantitySold || 0), 0);
    const avgStock =
      items.reduce((sum, i) => sum + i.quantity, 0) / items.length;
    return (sold / avgStock).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            Inventory Intelligence
          </h1>

          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 text-white rounded-lg"
            >
              <Home size={18} />
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl"
            >
              <Plus size={18} /> Add Item
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <StatItem
            icon={<Package />}
            label="Total Items"
            value={analytics?.totalItems || 0}
            gradient="from-blue-500 to-cyan-500"
            sublabel="Active"
            subvalue="In Stock"
          />
          <StatItem
            icon={<TrendingUp />}
            label="Turnover Ratio"
            value={`${calculateTurnover()}x`}
            gradient="from-indigo-500 to-blue-500"
            sublabel="Healthy"
            subvalue="Annual"
            positive
          />
        </div>

        {/* Search */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
        />

        {/* Table */}
        <InventoryTable
          items={filteredItems}
          deleteItem={deleteItem}
          openAdd={() => setShowAddModal(true)}
        />
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

/* ===================== COMPONENTS ===================== */

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel: string;
  subvalue: string;
  gradient: string;
  positive?: boolean;
}

function StatItem({
  icon,
  label,
  value,
  sublabel,
  subvalue,
  gradient,
  positive,
}: StatItemProps) {
  return (
    <div className="bg-white/10 p-6 rounded-xl flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div className={`p-3 bg-gradient-to-r ${gradient} rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-purple-200">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      <div
        className={`text-sm ${positive ? "text-green-400" : "text-purple-300"}`}
      >
        {sublabel}
        <div className="text-xs">{subvalue}</div>
      </div>
    </div>
  );
}

function SearchFilters({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categories,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  categories: string[];
}) {
  return (
    <div className="bg-white/10 p-4 rounded-xl flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 text-purple-300" size={18} />
        <input
          className="pl-10 pr-4 py-2 w-full bg-white/10 text-white rounded-lg"
          placeholder="Search name or SKU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="bg-white/10 text-white px-4 rounded-lg"
      >
        {categories.map((c) => (
          <option key={c} className="bg-slate-800">
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

function InventoryTable({
  items,
  deleteItem,
  openAdd,
}: {
  items: InventoryItem[];
  deleteItem: (id: string) => void;
  openAdd: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center bg-white/10 p-10 rounded-xl">
        <Package size={48} className="mx-auto text-purple-400" />
        <p className="text-white mt-4">No items found</p>
        <button
          onClick={openAdd}
          className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg"
        >
          Add Item
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 rounded-xl overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-white/5">
          <tr>
            <th className="p-4">Item</th>
            <th>SKU</th>
            <th>Stock</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border-t border-white/10">
              <td className="p-4 text-white">{i.name}</td>
              <td className="text-purple-200">{i.sku}</td>
              <td className="text-white">{i.quantity}</td>
              <td className="text-emerald-400">
                ₹{(i.quantity * i.unitPrice).toLocaleString()}
              </td>
              <td>
                <button
                  onClick={() => deleteItem(i.id)}
                  className="p-2 text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddItemModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Cement",
    quantity: 0,
    unitPrice: 0,
    reorderPoint: 10,
    supplier: "",
    location: "Warehouse A",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_BASE}/api/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white/10 p-6 rounded-xl space-y-4 w-96"
      >
        <h2 className="text-white text-xl">Add Item</h2>
        {Object.keys(form).map((k) => (
          <input
            key={k}
            placeholder={k}
            value={(form as any)[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 text-white rounded"
          />
        ))}
        <div className="flex gap-2">
          <button className="flex-1 bg-purple-600 text-white py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white/10 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
