// Click row or Edit button → opens modal
// Modal edits productName, quantity, status
"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/page";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText, Edit, Trash2, Eye, X } from "lucide-react";

interface Product {
  sku: string;
  productName: string;
  category: string;
  brand: string;
  price: number;
  quantity: number;
  status: string;
  images?: string[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

export default function LowStockPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editData, setEditData] = useState({ productName: "", quantity: 0, status: "" });

  // Fetch low stock products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      const data: Product[] = await res.json();
      const lowStock = data.filter((p) => p.quantity <= 5);
      setProducts(lowStock);
      setFilteredProducts(lowStock);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter based on search
  useEffect(() => {
    const filtered = products.filter((p) => {
      const query = searchQuery.toLowerCase();
      return (
        p.productName.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    });
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Delete product
  const handleDelete = async (sku: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`${BACKEND_URL}/products/${sku}`, { method: "DELETE" });
        if (res.ok) {
          const updated = products.filter((p) => p.sku !== sku);
          setProducts(updated);
          setFilteredProducts(updated);
        } else {
          alert("Failed to delete product");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting product");
      }
    }
  };

  // Open modal
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditData({
      productName: product.productName,
      quantity: product.quantity,
      status: product.status,
    });
    setEditModalOpen(true);
  };

  // Save edited data
  const handleSave = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch(`${BACKEND_URL}/products/${selectedProduct.sku}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const updatedProducts = products.map((p) =>
          p.sku === selectedProduct.sku ? { ...p, ...editData } : p
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setEditModalOpen(false);
      } else {
        alert("Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
  };

  // Export Excel
  const exportToExcel = (data: Product[]) => {
    const excelData = data.map((p) => ({
      SKU: p.sku,
      Name: p.productName,
      Category: p.category,
      Brand: p.brand,
      Price: p.price,
      Quantity: p.quantity,
      Status: p.status,
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LowStock");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      "LowStockProducts.xlsx"
    );
  };

  // Export PDF
  const exportToPDF = (data: Product[]) => {
    const doc = new jsPDF();
    doc.text("Low Stock Products", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["SKU", "Name", "Category", "Brand", "Price", "Qty", "Status"]],
      body: data.map((p) => [p.sku, p.productName, p.category, p.brand, `$${p.price}`, p.quantity, p.status]),
    });
    doc.save("LowStockProducts.pdf");
  };

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold mb-4 bg-yellow-500 text-white p-3 rounded">Low Stock Products</h1>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="font-bold text-lg">Product List</h2>
          <h3 className="text-sm text-gray-600">Manage Low Stock Products</h3>
        </div>

        <div className="w-full md:w-1/2 flex justify-end items-center gap-3">
          <button onClick={() => exportToExcel(filteredProducts)} className="border px-4 py-2 rounded">
            <FileSpreadsheet size={18} className="text-[var(--accent)]" />
          </button>
          <button onClick={() => exportToPDF(filteredProducts)} className="border px-4 py-2 rounded">
            <FileText size={18} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between my-3 gap-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--accent)] text-white h-10 text-left">
              <th className="px-4">SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.sku}
                className="text-left border-b bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => openEditModal(p)}
              >
                <td className="px-4">{p.sku}</td>
                <td className="flex items-center gap-2">
                  <img
                    src={p.images?.[0] ? `${BACKEND_URL}${p.images[0]}` : "/no-image.png"}
                    alt={p.productName}
                    className="w-12 h-12 mt-3 mb-3 rounded object-cover"
                  />
                  <span>{p.productName}</span>
                </td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td>${p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      p.status.toLowerCase() === "active" ? "bg-yellow-600" : "bg-red-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/productdetail?sku=${p.sku}`);
                    }}
                    className="text-purple-500 hover:text-purple-700 mr-3"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(p);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.sku);
                    }}
                    className="text-red-500 hover:text-red-700 mr-3"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-96 relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setEditModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold">Product Name</label>
              <input
                type="text"
                value={editData.productName}
                onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                className="border px-3 py-2 rounded"
              />

              <label className="text-sm font-semibold">Quantity</label>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => setEditData({ ...editData, quantity: Number(e.target.value) })}
                className="border px-3 py-2 rounded"
              />

              <label className="text-sm font-semibold">Status</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                onClick={handleSave}
                className="bg-[var(--accent)] hover:bg-[var(--hover)] text-white px-4 py-2 rounded mt-4"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
