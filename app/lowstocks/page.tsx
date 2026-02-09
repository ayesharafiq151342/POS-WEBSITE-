"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/page";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Eye, FileSpreadsheet, FileText, Trash2 } from "lucide-react";

type Product = {
  sku: string;
  name: string;
  store: string;
  warehouse: string;
  quantity: number;
  qtyAlert: number;
  category: string;
  image?: string;
};

const LOW_STOCK_LIMIT = 10;

export default function LowStockPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 🔹 Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
      const data = await res.json();

      const mappedData: Product[] = data.map((p: any) => ({
        sku: p.sku || "",
        name: p.productName || "N/A",
        store: p.store || "Main Store",
        warehouse: p.warehouse || "Main Warehouse",
        quantity: Number(p.quantity) || 0,
        qtyAlert: Number(p.quantityAlert) || LOW_STOCK_LIMIT,
        category: p.category || "General",
        image: p.images?.[0] || null,
      }));

      setProducts(mappedData);
      setFilteredProducts(mappedData);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Filter products based on search
  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // 🔹 Low stock products
  const lowStockProducts = filteredProducts.filter(
    (p) => p.quantity <= (p.qtyAlert ?? LOW_STOCK_LIMIT)
  );

  // 🔹 Row color for low stock
  const getRowColor = (qty: number, qtyAlert: number) => (qty <= qtyAlert ? "bg-red-100" : "");

  // ✏️ Open Edit Modal
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // ✏️ Save edits
  const handleEditSave = async () => {
    if (!editingProduct) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${editingProduct.sku}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: editingProduct.sku,
            productName: editingProduct.name,
            category: editingProduct.category,
            store: editingProduct.store,
            warehouse: editingProduct.warehouse,
            quantity: editingProduct.quantity,
            quantityAlert: editingProduct.qtyAlert,
          }),
        }
      );

      if (res.ok) {
        // Update local state
        setProducts((prev) =>
          prev.map((p) => (p.sku === editingProduct.sku ? { ...editingProduct } : p))
        );
        setFilteredProducts((prev) =>
          prev.map((p) => (p.sku === editingProduct.sku ? { ...editingProduct } : p))
        );

        setShowEditModal(false);
        setEditingProduct(null);
        alert("Product updated successfully!");
      } else {
        const errMsg = await res.text();
        console.error("Update failed:", errMsg);
        alert("Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product");
    }
  };

  // 🗑 Delete product
  const handleDelete = async (sku: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${sku}`, {
        method: "DELETE",
      });
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
  };

  // 🔹 Export to Excel
  const exportToExcel = (list: Product[]) => {
    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LowStock");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "LowStock_List.xlsx");
  };

  // 🔹 Export to PDF
  const exportToPDF = (list: Product[]) => {
    const doc = new jsPDF();
    doc.text("Low Stock Products", 14, 10);
    const tableColumn = ["SKU", "Name", "Category", "Store", "Warehouse", "Qty", "Qty Alert"];
    const tableRows = list.map((p) => [p.sku, p.name, p.category, p.store, p.warehouse, p.quantity, p.qtyAlert]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("LowStock_List.pdf");
  };

  return (
    <Sidebar>
      <h1 className="text-3xl text-white font-bold mb-4 bg-[var(--accent)] p-4 rounded">
        Low Stock Products
      </h1>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="font-bold text-lg">Products</h2>
          <h3 className="text-sm text-gray-600">Manage your low stock products</h3>
        </div>
        <div className="w-full md:w-1/2 flex justify-end items-center gap-3">
          <button onClick={() => exportToExcel(lowStockProducts)} className="border px-4 py-2 rounded">
            <FileSpreadsheet size={18} className="text-green-600" />
          </button>
          <button onClick={() => exportToPDF(lowStockProducts)} className="border px-4 py-2 rounded ml-2">
            <FileText size={18} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, SKU, category, or store..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-black border-collapse">
          <thead>
            <tr className="bg-[var(--accent)] text-white h-10 text-left">
              <th className="px-4">SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Store</th>
              <th>Warehouse</th>
              <th>Qty</th>
              <th>Qty Alert</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((p, idx) => (
              <tr
                key={idx}
                className={`border-b bg-white hover:bg-gray-100 cursor-pointer ${getRowColor(p.quantity, p.qtyAlert)}`}
                onClick={() => handleEditClick(p)}
              >
                <td className="px-4">{p.sku}</td>
                <td className="flex items-center gap-2">
                  <img
                    src={p.image ? `http://localhost:5000${p.image}` : "/no-image.png"}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  {p.name}
                </td>
                <td>{p.category}</td>
                <td>{p.store}</td>
                <td>{p.warehouse}</td>
                <td>{p.quantity}</td>
                <td>{p.qtyAlert}</td>
                <td>
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/productdetail?sku=${p.sku}`); }}
                    className="text-purple-500 hover:text-purple-700 mr-3"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.sku); }}
                    className="text-red-500 hover:text-red-700"
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
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <div className="space-y-4">
              {/** SKU **/}
              <div>
                <label className="block font-medium mb-1">SKU</label>
                <input
                  type="text"
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/** Name **/}
              <div>
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/** Category **/}
              <div>
                <label className="block font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/** Store **/}
              <div>
                <label className="block font-medium mb-1">Store</label>
                <input
                  type="text"
                  value={editingProduct.store}
                  onChange={(e) => setEditingProduct({ ...editingProduct, store: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/** Warehouse **/}
              <div>
                <label className="block font-medium mb-1">Warehouse</label>
                <input
                  type="text"
                  value={editingProduct.warehouse}
                  onChange={(e) => setEditingProduct({ ...editingProduct, warehouse: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/** Quantity **/}
              <div>
                <label className="block font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/** Quantity Alert **/}
              <div>
                <label className="block font-medium mb-1">Quantity Alert</label>
                <input
                  type="number"
                  value={editingProduct.qtyAlert}
                  onChange={(e) => setEditingProduct({ ...editingProduct, qtyAlert: Number(e.target.value) })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditSave}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-md py-2 font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white rounded-md py-2 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
