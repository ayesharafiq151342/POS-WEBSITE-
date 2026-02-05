"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/sidebar/page";
import { Edit, Trash2 } from "lucide-react";

type Product = {
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  qty: number;
};

const LOW_STOCK_LIMIT = 10;

export default function LowStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  // 🔹 Fetch products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
        const data = await res.json();

      const mapped: Product[] = (data as Product[]).map((p) => ({
  sku: p.sku,
  name: p.name || "N/A",
  category: p.category || "N/A",
  warehouse: p.warehouse || "Main Store",
  qty: Number(p.qty || 0),
}));


        setProducts(mapped); // ✅ setState after async fetch
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    loadProducts();
  }, []);

  // 🔴 Only LOW STOCK products
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.qty <= LOW_STOCK_LIMIT);
  }, [products]);

  // 🎨 Row color
  const getRowColor = (qty: number) =>
    qty <= LOW_STOCK_LIMIT ? "bg-red-100" : "";

  // ✏️ Edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditQty(product.qty);
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${editingProduct.sku}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qty: editQty }),
        }
      );

      if (res.ok) {
        setProducts(prev =>
          prev.map(p =>
            p.sku === editingProduct.sku ? { ...p, qty: editQty } : p
          )
        );
        setEditingProduct(null);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // 🗑 Delete
  const handleDelete = async (sku: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${sku}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.sku !== sku));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold text-white bg-red-600 p-4 rounded mb-6">
        Warehouse – Low Stock Products
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">Warehouse</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {lowStockProducts.map(p => (
              <tr
                key={p.sku}
                className={`border-b ${getRowColor(p.qty)}`}
              >
                <td className="p-3">{p.warehouse}</td>
                <td className="p-3 font-semibold">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3 font-bold text-red-600">
                  {p.qty}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.sku)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {lowStockProducts.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            🎉 No low stock products
          </p>
        )}
      </div>

      {/* ✏️ Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="text-xl font-bold mb-4">
              Edit Quantity – {editingProduct.name}
            </h2>

            <input
              type="number"
              value={editQty}
              onChange={e => setEditQty(Number(e.target.value))}
              className="border p-2 w-full mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 bg-gray-400 text-white py-2 rounded"
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
