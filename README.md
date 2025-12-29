# Inventory Management System with ABC Analysis

A full-stack **Inventory Management Web Application** built for **AEC (Architecture, Engineering & Construction) businesses** to reduce dead inventory, improve inventory turnover, and make data-driven stocking decisions using **ABC inventory analysis**.

This system helps businesses gain confidence in scaling their operations by clearly identifying high-value, medium-value, and low-value inventory items.

---
## 🌐 Deployment

Live Application: https://inventory-abc-management-frontend.onrender.com/

## 🚀 Key Features

### 📦 Inventory Management (CRUD)
- Create, Read, Update, and Delete inventory items  
- Track SKU, category, quantity, unit price, supplier, and warehouse location  
- Automatic inventory valuation based on quantity × unit price  

### 📊 ABC Inventory Analysis
- Automatic classification of items into **A, B, and C categories**
- Prioritizes inventory based on revenue contribution
- Enables focused management of high-impact SKUs

### ⚠️ Smart Insights
- Low-stock alerts  
- ABC distribution summary  
- Inventory valuation  
- Recent inventory updates  

### 🖥️ Dashboard & UI
- Clean, responsive dashboard  
- Search and filter inventory by name, SKU, or category  
- Real-time UI updates after CRUD operations  

---

## 🧠 ABC Classification Logic

ABC analysis categorizes inventory based on **annual revenue contribution**.
### Steps:
1. Calculate revenue per item
2. Sort items by revenue in descending order  
3. Calculate cumulative revenue percentage  
4. Assign categories:
- **A Category** → Top 80% cumulative revenue  
- **B Category** → Next 15%  
- **C Category** → Remaining 5%  

### Why ABC?
- **A items** → High value, strict control  
- **B items** → Moderate control  
- **C items** → Low value, minimal control  

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express.js
- RESTful APIs
- JSON-based storage (for simplicity)

---

## 📂 Project Structure

```text
inventory-management/
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── package.json
│
├── server.js
├── inventory.json
├── README.md
└── .gitignore
 
