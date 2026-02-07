"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/page";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText, Trash2, Eye } from "lucide-react";

type Product = {
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  status: string;
  manufacturedDate: string;
  image?: string;
};

export default function Product() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturedDate, setManufacturedDate] = useState("");

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSubcategory, setEditSubcategory] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editManufacturedDate, setEditManufacturedDate] = useState("");

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
      const data = await res.json();

    const mappedData: Product[] = data.map((p: any) => ({
  sku: p.sku || "",
  name: p.productName || "N/A",
  category: p.category || "N/A",
  subcategory: p.subcategory || "N/A",
  status: p.status || "Active",
  manufacturedDate: p.warranty?.manufacturedDate || "N/A",
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

  // 🔹 Search + Filter
  useEffect(() => {
    const filtered = products.filter(p => {
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        category === "" || p.category.toLowerCase() === category.toLowerCase();

      const matchesManufacturedDate =
        manufacturedDate === "" || p.manufacturedDate.toLowerCase() === manufacturedDate.toLowerCase();

      return matchesSearch && matchesCategory && matchesManufacturedDate;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, category, manufacturedDate, products]);

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

  // 🔹 Open Edit Modal
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditSku(product.sku);
    setEditCategory(product.category);
    setEditSubcategory(product.subcategory);
    setEditStatus(product.status);
    setEditManufacturedDate(product.manufacturedDate);
    setShowEditModal(true);
  };

  // 🔹 Save Edited Product
  const handleEditSave = async () => {
    if (!editingProduct) return;

    try {
const response = await fetch(`http://localhost:5000/products/${editingProduct.sku}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: editName,
          sku: editSku,
          category: editCategory,
          subcategory: editSubcategory,
          status: editStatus,
          warranty: {
            manufacturedDate: editManufacturedDate,
          },
        }),
      });

      if (response.ok) {
        const updated = products.map(p =>
          p.sku === editingProduct.sku
            ? {
                ...p,
                name: editName,
                sku: editSku,
                category: editCategory,
                subcategory: editSubcategory,
                status: editStatus,
                manufacturedDate: editManufacturedDate,
              }
            : p
        );
        setProducts(updated);
        setFilteredProducts(updated);
        setShowEditModal(false);
        alert("Product updated successfully!");
      } else {
        alert("Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
  };

  // 🔹 Export to Excel
  const exportToExcel = (list: Product[]) => {
    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "Products_List.xlsx");
  };

  // 🔹 Export to PDF
  const exportToPDF = (list: Product[]) => {
    const doc = new jsPDF();
    doc.text("Product List", 14, 10);

    const tableColumn = ["SKU", "Name", "Category", "Subcategory", "Status", "Manufactured Date"];
    const tableRows = list.map(p => [p.sku, p.name, p.category, p.subcategory, p.status, p.manufacturedDate]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Products_List.pdf");
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
          <button onClick={() => exportToExcel(filteredProducts)} className="border px-4 py-2 rounded">
            <FileSpreadsheet size={18} className="text-green-600" />
          </button>

          <button onClick={() => exportToPDF(filteredProducts)} className="border px-4 py-2 rounded ml-2">
            <FileText size={18} className="text-red-600" />
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
                </div>
              </th>
            </tr>

            <tr className="bg-[var(--accent)] text-white h-10 text-left">
              <th>Category</th>
              <th>Subcategory</th>
              <th>Status</th>
              <th>Manufactured Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, idx) => (
              <tr
                key={idx}
                className="text-left border-b bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => handleEditClick(p)}
              >
                <td>{p.category}</td>
                <td>{p.subcategory}</td>
                <td>{p.status}</td>
                <td>{p.manufacturedDate}</td>
                <td>
                  <button
                    onClick={e => { e.stopPropagation(); router.push(`/productdetail?sku=${p.sku}`); }}
                    className="text-purple-500 hover:text-purple-700 mr-3"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(p.sku); }}
                    className="text-red-500 hover:text-red-700 mr-3"
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

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">SKU</label>
                <input
                  type="text"
                  value={editSku}
                  onChange={e => setEditSku(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Subcategory</label>
                <input
                  type="text"
                  value={editSubcategory}
                  onChange={e => setEditSubcategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Manufactured Date</label>
                <input
                  type="date"
                  value={editManufacturedDate}
                  onChange={e => setEditManufacturedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
