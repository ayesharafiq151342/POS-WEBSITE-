"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar/page";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

interface Warranty {
  warranty: string;
  manufacturer: string;
  manufacturedDate?: string;
  expiryDate?: string;
}

interface Product {
  productName: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  quantity: number;
  status: string;
  description?: string;
  images?: string[];
  warranty?: Warranty;
}

export default function ProductsDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "lowstock">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      const data: Product[] = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Filter products based on search
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filtered = products.filter((p) => {
      return (
        p.productName.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  if (loading) return <p className="p-6">Loading products...</p>;

  const today = new Date();

  // 🔹 Remaining Days for warranty expiry
  const getRemainingDays = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const diff = new Date(expiryDate).getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // 🔹 Low Stock Products (quantity ≤ 5)
  const lowStockProducts = filteredProducts.filter((p) => p.quantity <= 5);

  // 🔹 Determine displayed products based on tab
  const displayedProducts = tab === "all" ? filteredProducts : lowStockProducts;

  // ================= EXPORTS =================

  const exportToExcel = (data: Product[]) => {
    const excelData = data.map((p) => ({
      SKU: p.sku,
      Name: p.productName,
      Category: p.category,
      Brand: p.brand,
      Price: p.price,
      Quantity: p.quantity,
      Status: p.status,
      Expiry: p.warranty?.expiryDate || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Products.xlsx"
    );
  };

  const exportToPDF = (data: Product[]) => {
    const doc = new jsPDF();
    doc.text("Product List", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["SKU", "Name", "Category", "Price", "Qty", "Status"]],
      body: data.map((p) => [p.sku, p.productName, p.category, `$${p.price}`, p.quantity, p.status]),
    });

    doc.save("Products.pdf");
  };

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold mb-4 bg-[var(--accent)] text-white p-3 rounded">
        Products Dashboard
      </h1>

      {/* Header Actions */}
      {/* <div className="flex justify-between items-center mb-6">
       

        <div className="flex gap-2">
          <button onClick={() => exportToExcel(displayedProducts)} className="border px-3 py-2 rounded">
            <FileSpreadsheet className="text-green-600" />
          </button>

          <button onClick={() => exportToPDF(displayedProducts)} className="border px-3 py-2 rounded">
            <FileText className="text-red-600" />
          </button>

         
        </div>
      </div> */}

      {/* Tabs */}
      {/* <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded ${tab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All Products
        </button>

        <button
          onClick={() => setTab("lowstock")}
          className={`px-4 py-2 rounded ${tab === "lowstock" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
        >
          Low Stock
        </button>

        <button
          onClick={() => router.push("/expire")}
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          Expired Page
        </button>
      </div> */}

      {/* Search */}
     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
           <div className="relative w-full md:w-10/12">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
             <input
               type="text"
               placeholder="Search by Name, SKU, Category, or Brand..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
             />
           </div>
   
           <div className="flex gap-2">
             <button onClick={() => exportToExcel(filteredProducts)} className="border px-3 py-2 rounded">
               <FileSpreadsheet className="text-green-600" />
             </button>
             <button onClick={() => exportToPDF(filteredProducts)} className="border px-3 py-2 rounded">
               <FileText className="text-red-600" />
             </button> <button
            onClick={() => router.push("/createproduct")}
            className="bg-[var(--accent)] px-4 py-2 text-white rounded"
          >
            Add Product
          </button>
           </div>
         </div>

      {/* Products Grid */}
      {/* Products Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {displayedProducts.map((product) => {
    const remainingDays = getRemainingDays(product.warranty?.expiryDate);
    const isExpired = remainingDays !== null && remainingDays < 0;
    const isLowStock = product.quantity <= 5;

    return (
      <div
        key={product.sku}
        onClick={() => isExpired && router.push("/expire")}
        className={`relative rounded-xl p-4 shadow-md cursor-pointer hover:scale-105 transition
          ${
            isExpired
              ? "bg-red-50 border-2 border-red-500"
              : isLowStock
              ? "bg-yellow-50 border-2 border-yellow-400"
              : "bg-white border"
          }`}
      >
        {/* Product Image */}
        <div className="relative w-82 h-72 m-auto rounded-xl overflow-hidden mb-4 flex items-center justify-center">
          <img
            src={product.images?.[0] ? `${BACKEND_URL}${product.images[0]}` : "/no-image.png"}
            alt={product.productName}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/no-image.png";
            }}
            className="w-full h-full object-cover transition-transform duration-300"
          />

          {/* Expired Badge */}
          {isExpired && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              EXPIRED
            </span>
          )}

          {/* Low Stock Badge */}
          {isLowStock && !isExpired && (
            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              Low Stock
            </span>
          )}

          {/* Warranty Expiry Badge */}
          {remainingDays !== null && remainingDays > 0 && remainingDays <= 3 && !isExpired && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              {remainingDays}d left
            </span>
          )}
        </div>

        <h2 className="font-semibold text-lg">{product.productName}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description || "No description"}</p>
        <p className="font-bold mt-2">${product.price}</p>
        <p className="text-sm">Qty: {product.quantity}</p>
        <p className="text-sm text-gray-600">{product.category} - {product.brand}</p>
      </div>
    );
  })}
</div>

    </Sidebar>
  );
}
