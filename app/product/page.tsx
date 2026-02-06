"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/page";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText, Edit, Trash2, Plus, Eye } from "lucide-react";

type Product = {
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
  qty: number;
  createdBy: string;
  status: string;
  image?: string;
};

export default function Product() {
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  // 🔹 Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      const data = await res.json();

      const mappedData: Product[] = data.map((p: any) => ({
        sku: p.sku || "",
        name: p.productName || "N/A",
        category: p.category || "N/A",
        brand: p.brand || "N/A",
        price: p.price || 0,
        unit: p.unit || "N/A",
        qty: p.quantity || 0,
        createdBy: p.createdBy || "Admin",
        status: p.status || "Active",
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

  // 🔹 Search & Filter
  useEffect(() => {
    const filtered = products.filter(p => {
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === "" || p.category.toLowerCase() === category.toLowerCase();
      const matchesBrand = brand === "" || p.brand.toLowerCase() === brand.toLowerCase();
      return matchesSearch && matchesCategory && matchesBrand;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, category, brand, products]);

  // 🔹 Delete Product
  const handleDelete = async (sku: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${BACKEND_URL}/products/${sku}`, { method: "DELETE" });
        if (response.ok) {
          const updated = products.filter(p => p.sku !== sku);
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

  // 🔹 Export Excel
  const exportToExcel = (products: Product[]) => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "Product_List.xlsx");
  };

  // 🔹 Export PDF
  const exportToPDF = (products: Product[]) => {
    const doc = new jsPDF();
    doc.text("Product List", 14, 10);

    const tableColumn = ["SKU", "Name", "Category", "Price", "Quantity"];
    const tableRows = products.map(p => [p.sku, p.name, p.category, p.price, p.qty]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("Product_List.pdf");
  };

  return (
    <Sidebar>
      <h1 className="text-3xl text-white font-bold mb-4 bg-[var(--accent)] p-4 rounded">
        Product Management
      </h1>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="font-bold text-lg">Product List</h2>
          <h3 className="text-sm text-gray-600">Manage Your Products</h3>
        </div>

        <div className="w-full md:w-1/2 flex justify-end items-center gap-3">
          <button
            onClick={() => exportToExcel(filteredProducts)}
            className="border px-4 py-2 rounded"
          >
            <FileSpreadsheet size={18} className="text-[var(--accent)]" />
          </button>

          <button
            onClick={() => exportToPDF(filteredProducts)}
            className="border px-4 py-2 rounded ml-2"
          >
            <FileText size={18} className="text-red-600" />
          </button>

          <button
            onClick={() => router.push("/createproduct")}
            className="bg-[var(--accent)] hover:bg-[var(--hover)] rounded h-10 px-4 text-white"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th colSpan={12}>
                <div className="flex items-center justify-between my-3 gap-4">
                  {/* Search */}
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="Search Products..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-3">
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="py-2 px-3 border rounded-md"
                    >
                      <option value="">Category</option>
                      <option value="Computer">Computer</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Shoe">Shoe</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Mobile">Mobile</option>
                    </select>

                    <select
                      value={brand}
                      onChange={e => setBrand(e.target.value)}
                      className="py-2 px-3 border rounded-md"
                    >
                      <option value="">Brand</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Adidas">Adidas</option>
                      <option value="Nike">Nike</option>
                      <option value="Apple">Apple</option>
                    </select>

                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCategory("");
                        setBrand("");
                      }}
                      className="px-3 py-2 border rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </th>
            </tr>
            <tr className="bg-[var(--accent)] text-white h-10 text-left">
              <th className="px-4">SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, idx) => (
              <tr
                key={idx}
                          className={`border-b  bg-white hover:bg-gray-100 cursor-pointer`}

                onClick={() => router.push(`/createproduct?edit=${p.sku}`)}
              >
                <td className="px-4">{p.sku}</td>
                <td className="flex items-center gap-2">
                  <img
                    src={p.image ? `http://localhost:5000${p.image}` : "/no-image.png"}
                    alt={p.name}
                                      className="w-12 h-12 mt-3 mb-3 rounded object-cover"

                  />
                  <span>{p.name}</span>
                </td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td>{p.price}</td>
                <td>{p.unit}</td>
                <td>{p.qty}</td>
                <td>{p.createdBy}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      p.status.toLowerCase() === "active"
                        ? "bg-[var(--accent)]"
                        : p.status.toLowerCase() === "inactive"
                        ? "bg-red-400"
                        : "bg-yellow-500"
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
                      router.push(`/createproduct?edit=${p.sku}`);
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/createproduct");
                    }}
                    className="text-[var(--accent)] hover:text-green-700"
                  >
                    <Plus size={18} />
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
