// server.js - Express Backend for Inventory Management
const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "inventory.json");

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
const initializeDataFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData = {
      items: [],
      transactions: [],
      settings: {
        lowStockThreshold: 10,
        categories: [
          "Cement",
          "Steel",
          "Tiles",
          "Paint",
          "Plumbing",
          "Electrical",
          "Hardware",
        ],
      },
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Helper functions
const readData = async () => {
  const data = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(data);
};

const writeData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

const calculateABCCategory = (items) => {
  // Calculate total revenue for all items
  const itemsWithRevenue = items.map((item) => ({
    ...item,
    revenue: (item.unitPrice || 0) * (item.quantitySold || 0),
  }));

  const totalRevenue = itemsWithRevenue.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  // Sort by revenue descending
  itemsWithRevenue.sort((a, b) => b.revenue - a.revenue);

  let cumulativeRevenue = 0;
  return itemsWithRevenue.map((item) => {
    cumulativeRevenue += item.revenue;
    const revenuePercentage = (cumulativeRevenue / totalRevenue) * 100;

    let abcCategory = "C";
    if (revenuePercentage <= 80) abcCategory = "A";
    else if (revenuePercentage <= 95) abcCategory = "B";

    return { ...item, abcCategory };
  });
};

// Routes

// GET all inventory items
app.get("/api/inventory", async (req, res) => {
  try {
    const data = await readData();
    const itemsWithABC = calculateABCCategory(data.items);
    res.json({ items: itemsWithABC, settings: data.settings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// GET single inventory item
app.get("/api/inventory/:id", async (req, res) => {
  try {
    const data = await readData();
    const item = data.items.find((i) => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

// POST new inventory item
app.post("/api/inventory", async (req, res) => {
  try {
    const data = await readData();
    const newItem = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      quantitySold: 0,
      ...req.body,
    };
    data.items.push(newItem);

    // Add transaction
    data.transactions.push({
      id: Date.now().toString(),
      itemId: newItem.id,
      type: "ADD",
      quantity: newItem.quantity,
      timestamp: new Date().toISOString(),
      notes: "Initial stock",
    });

    await writeData(data);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create item" });
  }
});

// PUT update inventory item
app.put("/api/inventory/:id", async (req, res) => {
  try {
    const data = await readData();
    const index = data.items.findIndex((i) => i.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    const oldQuantity = data.items[index].quantity;
    data.items[index] = { ...data.items[index], ...req.body };

    // Track quantity changes
    if (oldQuantity !== data.items[index].quantity) {
      data.transactions.push({
        id: Date.now().toString(),
        itemId: req.params.id,
        type: data.items[index].quantity > oldQuantity ? "RESTOCK" : "SALE",
        quantity: Math.abs(data.items[index].quantity - oldQuantity),
        timestamp: new Date().toISOString(),
        notes: req.body.notes || "",
      });
    }

    await writeData(data);
    res.json(data.items[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE inventory item
app.delete("/api/inventory/:id", async (req, res) => {
  try {
    const data = await readData();
    const index = data.items.findIndex((i) => i.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    data.items.splice(index, 1);
    await writeData(data);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// GET analytics
app.get("/api/analytics", async (req, res) => {
  try {
    const data = await readData();
    const itemsWithABC = calculateABCCategory(data.items);

    const totalValue = itemsWithABC.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const lowStockItems = itemsWithABC.filter(
      (item) => item.quantity <= data.settings.lowStockThreshold
    );

    const abcDistribution = {
      A: itemsWithABC.filter((i) => i.abcCategory === "A").length,
      B: itemsWithABC.filter((i) => i.abcCategory === "B").length,
      C: itemsWithABC.filter((i) => i.abcCategory === "C").length,
    };

    const categoryDistribution = {};
    itemsWithABC.forEach((item) => {
      categoryDistribution[item.category] =
        (categoryDistribution[item.category] || 0) + 1;
    });

    res.json({
      totalItems: itemsWithABC.length,
      totalValue,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      abcDistribution,
      categoryDistribution,
      recentTransactions: data.transactions.slice(-10).reverse(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// GET transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const data = await readData();
    res.json(data.transactions.reverse());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Initialize and start server
initializeDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

