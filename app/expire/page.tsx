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
  category: string;
  images?: string[];
  expiryDate?: string;
  manufacturingDate?: string;
};

export default function ExpiredProductsPage() {
  const BACKEND_URL = "http://localhost:5000";
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch expired products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
      const data = await res.json();

      const today = new Date();

      const expiredData: Product[] = data
        .filter(
          (p: any) =>
            p.warranty?.expiryDate &&
            new Date(p.warranty.expiryDate) < today
        )
        .map((p: any) => ({
          sku: p.sku || "",
          name: p.productName || "N/A",
          store: p.store || "Main Store",
          warehouse: p.warehouse || "Main Warehouse",
          quantity: Number(p.quantity) || 0,
          category: p.category || "General",
          images: p.images || [], // keep as array
          expiryDate: p.warranty?.expiryDate || "",
          manufacturingDate: p.warranty?.manufacturedDate || "",
        }));

      setProducts(expiredData);
      setFilteredProducts(expiredData);
    } catch (err) {
      console.error("Error fetching expired products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Search filter
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

  // 🗑 Delete
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

  // 📊 Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExpiredProducts");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "Expired_Products.xlsx");
  };

  // 📄 Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Expired Products", 14, 10);

    const tableColumn = [
      "SKU",
      "Name",
      "Category",
      "Store",
      "Warehouse",
      "Qty",
      "Manufacturing Date",
      "Expiry Date",
    ];

    const tableRows = filteredProducts.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.store,
      p.warehouse,
      p.quantity,
      p.manufacturingDate,
      p.expiryDate,
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("Expired_Products.pdf");
  };

  return (
    <Sidebar>
      <h1 className="text-3xl text-white font-bold mb-4 bg-[var(--accent)] p-4 rounded">
        Expired Products
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="font-bold text-lg">Expired List</h2>
          <h3 className="text-sm text-gray-600">Manage expired products</h3>
        </div>

        <div className="w-full md:w-1/2 flex justify-end items-center gap-3">
          <button onClick={exportToExcel} className="border px-4 py-2 rounded">
            <FileSpreadsheet size={18} className="text-green-600" />
          </button>
          <button onClick={exportToPDF} className="border px-4 py-2 rounded">
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
              
              <th>Manufacturing Date</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, idx) => (
              <tr key={idx}                           className={`border-b  bg-white hover:bg-gray-100 cursor-pointer`}
>
                <td className="px-4">{p.sku}</td>

                <td className="flex items-center gap-2">
                  <img
                    src={p.images?.[0] ? `${BACKEND_URL}${p.images[0]}` : "/no-image.png"}
                    alt={p.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/no-image.png";
                    }}
                    className="w-12 h-12 object-contain rounded"
                  />
                  <span>{p.name}</span>
                </td>
                <td>{p.category}</td>
                
                <td>{p.manufacturingDate}</td>
                <td className="text-red-600">{p.expiryDate}</td>

                <td>
                  <button
                    onClick={() => router.push(`/productdetail?sku=${p.sku}`)}
                    className="text-purple-500 hover:text-purple-700 mr-3"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(p.sku)}
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
    </Sidebar>
  );
}
