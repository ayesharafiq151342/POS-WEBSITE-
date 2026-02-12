"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/page";
import { useRouter } from "next/navigation";
import { Eye, FileSpreadsheet, FileText, Trash2, X } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Product = {
  sku: string;
  name: string;
  quantity: number;
  category: string;
  images?: string[];
  expiryDate?: string;
  manufacturingDate?: string;
};

export default function ExpiredProductsPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Fetch Expired Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      const data = await res.json();
      const today = new Date();

      const expired = data
        .filter(
          (p: any) =>
            p.warranty?.expiryDate &&
            new Date(p.warranty.expiryDate) < today
        )
        .map((p: any) => ({
          sku: p.sku,
          name: p.productName,
          quantity: p.quantity,
          category: p.category,
          images: p.images || [],
          expiryDate: p.warranty?.expiryDate?.split("T")[0] || "",
          manufacturingDate:
            p.warranty?.manufacturedDate?.split("T")[0] || "",
        }));

      setProducts(expired);
      setFilteredProducts(expired);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search
  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Open Edit
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  // Update
  const handleUpdate = async () => {
    if (!editProduct) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/products/${editProduct.sku}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: editProduct.name,
            warranty: {
              manufacturedDate: editProduct.manufacturingDate,
              expiryDate: editProduct.expiryDate,
            },
          }),
        }
      );

      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (sku: string) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`${BACKEND_URL}/products/${sku}`, {
      method: "DELETE",
    });

    fetchProducts();
  };
  const exportToExcel = (data: Product[]) => {
    const excelData = data.map((p) => ({
      SKU: p.sku,
      Productname: p.name,
      expiryDate: p.expiryDate,

      manufacturingDate: p.manufacturingDate,
      Quantity: p.quantity,

    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expire Product");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      "ExpireProduct.xlsx"
    );
  };

  const exportToPDF = (data: Product[]) => {
  const doc = new jsPDF();

  doc.text("Expire Products", 14, 10);

  autoTable(doc, {
    startY: 20,

    head: [["SKU", "Name", "Category", "Manufacturing Date", "Expiry Date"]],

    body: data.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.manufacturingDate,
      p.expiryDate,
    ]),

    theme: "grid", // optional

    headStyles: {
      fillColor: [30, 138, 138], // Purple (RGB)
      textColor: 255, // White text
      halign: "center",
    },

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245], // light grey rows
    },
  });

  doc.save("ExpireProduct.pdf");
};

  return (
    <Sidebar>
      <h1 className="text-3xl text-white font-bold mb-4 bg-[var(--accent)] p-4 rounded">
        Expired Products
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="font-bold text-lg">Product List</h2>
          <h3 className="text-sm text-gray-600">Manage Low Stock Products</h3>
        </div>

        <div className="w-full md:w-1/2 flex justify-end items-center gap-3">
          <button onClick={() => exportToExcel(filteredProducts)} className="border px-4 py-2 rounded">
            <FileSpreadsheet size={18} className="text-[var(--accent)] " />
          </button>
          <button onClick={() => exportToPDF(filteredProducts)} className="border px-4 py-2 rounded">
            <FileText size={18} className="text-red-600" />
          </button>
        </div>
      </div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />

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
              <tr
                key={idx}
                onClick={() => handleEdit(p)}
                className="border-b bg-white hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-4">{p.sku}</td>

                <td className="flex items-center gap-2">
                  <img
                    src={
                      p.images?.[0]
                        ? `${BACKEND_URL}${p.images[0]}`
                        : "/no-image.png"
                    }
                    className="w-12 h-12 mt-3 mb-3 rounded object-cover"

                  />
                  {p.name}
                </td>

                <td>{p.category}</td>
                <td>{p.manufacturingDate}</td>
                <td className="text-red-600">{p.expiryDate}</td>

                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/productdetail?sku=${p.sku}`);
                    }}
                    className="text-purple-500 mr-3"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.sku);
                    }}
                    className="text-red-500"
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
      {showModal && editProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-96 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          ><button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={() => setShowModal(false)}
          >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Edit Product
            </h2>

            <div className="flex flex-col gap-4">

              {/* Product Name */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              {/* Manufacturing Date */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  value={editProduct.manufacturingDate}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      manufacturingDate: e.target.value,
                    })
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={editProduct.expiryDate}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      expiryDate: e.target.value,
                    })
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--hover)] text-white transition shadow-md"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Sidebar>
  );
}
