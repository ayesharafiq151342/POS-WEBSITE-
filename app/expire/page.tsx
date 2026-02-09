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
  manufacturer: string;
  expiryDate: string;
  image?: string;
};

export default function Product() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editManufacturer, setEditManufacturer] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
      const data = await res.json();

      const mappedData: Product[] = data.map((p: any) => ({
        sku: p.sku || "",
        name: p.productName || "N/A",
        manufacturer: p.warranty?.manufacturer || "N/A",
        expiryDate: p.warranty?.expiryDate || "N/A",
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
    const filtered = products.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesManufacturer =
        manufacturer === "" || p.manufacturer.toLowerCase() === manufacturer.toLowerCase();

      const matchesExpiryDate =
        expiryDate === "" || p.expiryDate.toLowerCase() === expiryDate.toLowerCase();

      return matchesSearch && matchesManufacturer && matchesExpiryDate;
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

  // 🔹 Open Edit Modal
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditManufacturer(product.manufacturer);
    setEditSku(product.sku);
    setEditExpiryDate(product.expiryDate);
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
          warranty: {
            manufacturer: editManufacturer,
            expiryDate: editExpiryDate,
          },
        }),
      });

      if (response.ok) {
        const updated = products.map((p) =>
          p.sku === editingProduct.sku
            ? { ...p, name: editName, sku: editSku, manufacturer: editManufacturer, expiryDate: editExpiryDate }
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

  // 🔹 Export Excel
  const exportToExcel = (list: Product[]) => {
    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expire List");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "Expire_List.xlsx");
  };

  // 🔹 Export PDF
  const exportToPDF = (list: Product[]) => {
    const doc = new jsPDF();
    doc.text("Expire List", 14, 10);

    const tableColumn = ["SKU", "Name", "Manufacturer", "Expiry Date"];
    const tableRows = list.map((p) => [p.sku, p.name, p.manufacturer, p.expiryDate]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Expire_List.pdf");
  };

  // 🔹 Lock scroll when modal is open
  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showEditModal]);

  return (
    <Sidebar>
      <h1 className="text-3xl text-white font-bold mb-4 bg-[var(--accent)] p-4 rounded">
        Product Management
      </h1>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="font-bold text-lg">Expire List</h2>
          <h3 className="text-sm text-gray-600">Manage Products Expiry Dates</h3>
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </th>
            </tr>

            <tr className="bg-[var(--accent)] text-white h-10 text-left">
              <th className="px-4">SKU</th>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>Expiry Date</th>
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
                <td className="px-4">{p.sku}</td>
                <td className="flex items-center justify-start gap-2">
                  <img
                    src={p.image ? `http://localhost:5000${p.image}` : "/no-image.png"}
                    alt={p.name}
                    className="w-12 h-12 mt-3 mb-3 rounded object-cover"
                  />
                  <span>{p.name}</span>
                </td>
                <td>{p.manufacturer}</td>
                <td>{p.expiryDate}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/productdetail?sku=${p.sku}`);
                    }}
                    className="text-purple-500 hover:text-purple-700 mr-3"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.sku);
                    }}
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
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">SKU</label>
                <input
                  type="text"
                  value={editSku}
                  onChange={(e) => setEditSku(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={editManufacturer}
                  onChange={(e) => setEditManufacturer(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
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
