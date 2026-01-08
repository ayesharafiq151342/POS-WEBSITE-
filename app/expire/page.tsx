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
   manufacturer: string;
  expiryDate: string
 
  image?: string;
};

export default function Product() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // 🔹 Fetch Products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
      const data = await res.json();

      const mappedData: Product[] = data.map((p: any) => ({
        sku: p.sku || "",
        name: p.productName || "N/A",
        manufacturer: p.manufacturer || "N/A",
        expiryDate: p.expiryDate || "N/A",
       
        status: p.status || "Active",
        image: p.images?.[0] || null, // ✅ Correct
      }));

      setProducts(mappedData);
      setFilteredProducts(mappedData);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // 🔹 Handle Image Upload
  const handleUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append("images", file));

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadedImages(data.urls);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Search + Filter
  useEffect(() => {
    const filtered = products.filter(p => {
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesmanufacturer =
        manufacturer === "" || p.manufacturer.toLowerCase() === manufacturer.toLowerCase();

      const matchesexpiryDate =
        expiryDate === "" || p.expiryDate.toLowerCase() === expiryDate.toLowerCase();

      return matchesSearch && matchesmanufacturer && matchesexpiryDate;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, manufacturer, expiryDate, products]);

  // 🔹 Delete Product
  const handleDelete = async (sku: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:5000/products/${sku}`, {
          method: "DELETE",
        });
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

    const tableColumn = ["SKU", "Name", "manufacturer", "Price", "Quantity"];
    const tableRows = products.map(p => [p.sku, p.name, p.manufacturer,]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Product_List.pdf");
  };

  return (
    <Sidebar>
      <h1 className="text-3xl text-white font-bold mb-4 bg-purple-400 p-4 rounded">
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
            <FileSpreadsheet size={18} className="text-green-600" />
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
        <table className="w-full text-black border-collapse">
          <thead>
            <tr>
              <th colSpan={12}>
                <div className="flex items-center justify-between my-3 gap-4">
                  {/* Search */}
                  <div className="relative w-64">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="Search Products..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-3">
                    <select
                      value={manufacturer}
                      onChange={e => setManufacturer(e.target.value)}
                      className="py-2 px-3 border rounded-md"
                    >
                      <option value="">manufacturer</option>
                      <option value="Computer">Computer</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Shoe">Shoe</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Mobile">Mobile</option>
                    </select>

                    <select
                      value={expiryDate}
                      onChange={e => setExpiryDate(e.target.value)}
                      className="py-2 px-3 border rounded-md"
                    >
                      <option value="">expiryDate</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Adidas">Adidas</option>
                      <option value="Nike">Nike</option>
                      <option value="Apple">Apple</option>
                    </select>

                    <button
                      onClick={() => {
                        setSearchQuery("");
                       setManufacturer("");
                        setExpiryDate("");
                      }}
                      className="px-3 py-2 border rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </th>
            </tr>

            <tr className="bg-[var(--accent)] text-center">
              <th>Image</th>
              <th>SKU</th>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>ExpiryDate</th>
             
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, idx) => (
              <tr key={idx} className="text-center border-b hover:bg-gray-100">
                <td className="px-3 py-2 flex justify-center">
                  <img
                    src={p.image ? `http://localhost:5000${p.image}` : "/no-image.png"} // ✅ Fixed
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td>{p.sku}</td>
                <td
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => router.push(`/createproduct?edit=${p.sku}`)}
                >
                  {p.name}
                </td>
                <td>{p.manufacturer}</td>
                <td>{p.expiryDate}</td>
            
              
                <td className="flex justify-center gap-2">
                  <button
                    onClick={() => router.push(`/productdetail?sku=${p.sku}`)}
                    className="text-purple-500 hover:text-purple-700"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
               
                  <button
                    onClick={() => handleDelete(p.sku)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
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
