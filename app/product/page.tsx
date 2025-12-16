"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/page";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet } from "lucide-react";
import { FileText } from "lucide-react";
import { Edit, Trash2, Plus } from "lucide-react";
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
const [products, setProducts] = useState<Product[]>([
  {
    sku: "SKU001",
    name: "Samsung Laptop",
    category: "Computer",
    brand: "Samsung",
    price: 800,
    unit: "Piece",
    qty: 10,
    createdBy: "Admin",
    status: "inactive",
      image: "/a.avif",
  },
  {
    sku: "SKU002",
    name: "Dell Desktop",
    category: "Computer",
    brand: "Dell",
    price: 900,
    unit: "Piece",
    qty: 5,
    createdBy: "Admin",
    status: "Active",
    image: "dell.jpg",
  },
  {
    sku: "SKU003",
    name: "iPhone 14",
    category: "Mobile",
    brand: "Apple",
    price: 1200,
    unit: "Piece",
    qty: 15,
    createdBy: "Admin",
    status: "Active",
    image: "iphone.jpg",
  },
  {
    sku: "SKU004",
    name: "Samsung TV",
    category: "Electronics",
    brand: "Samsung",
    price: 600,
    unit: "Piece",
    qty: 8,
    createdBy: "Admin",
    status: "inactive",
    image: "samsung-tv.jpg",
  },
  {
    sku: "SKU005",
    name: "Nike Running Shoes",
    category: "Shoe",
    brand: "Nike",
    price: 120,
    unit: "Pair",
    qty: 20,
    createdBy: "Admin",
    status: "Active",
    image: "nike-shoes.jpg",
  },
  {
    sku: "SKU006",
    name: "Adidas Sports Shirt",
    category: "Clothing",
    brand: "Adidas",
    price: 50,
    unit: "Piece",
    qty: 30,
    createdBy: "Admin",
    status: "inactive",
    image: "adidas-shirt.jpg",
  },
  {
    sku: "SKU007",
    name: "Sony Headphones",
    category: "Computer",
    brand: "Sony",
    price: 150,
    unit: "Piece",
    qty: 12,
    createdBy: "Admin",
    status: "Active",
    image: "sony-headphones.jpg",
  },
  {
    sku: "SKU008",
    name: "LG Refrigerator",
    category: "Electronics",
    brand: "LG",
    price: 1100,
    unit: "Piece",
    qty: 4,
    createdBy: "Admin",
    status: "Active",
    image: "lg-fridge.jpg",
  },
  {
    sku: "SKU009",
    name: "Wooden Sofa",
    category: "Furniture",
    brand: "Samsung",
    price: 700,
    unit: "Set",
    qty: 3,
    createdBy: "Admin",
    status: "inactive",
    image: "sofa.jpg",
  },
  {
    sku: "SKU010",
    name: "Xiaomi Smart Watch",
    category: "Accessories",
    brand: "Samsung",
    price: 90,
    unit: "Piece",
    qty: 25,
    createdBy: "Admin",
    status: "Active",
    image: "xiaomi-watch.jpg",
  },
]);

const exportToExcel = (products: Product[]) => {
  const worksheet = XLSX.utils.json_to_sheet(products);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(data, "Product_List.xlsx");
};
 const exportToPDF = (products: Product[]) => {
  const doc = new jsPDF();

  doc.text("Product List", 14, 10);

  const tableColumn = [
    "SKU",
    "Name",
    "Category",
    "Price",
    "Quantity",
  ];

  const tableRows = products.map((p) => [
    p.sku,
    p.name,
    p.category,
    p.price,
    p.qty,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("Product_List.pdf");
};
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  // 🔹 Fetch Products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔹 Search + Category + Brand Filter
  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        category === "" ||
        p.category.toLowerCase() === category.toLowerCase();

      const matchesBrand =
        brand === "" ||
        p.brand.toLowerCase() === brand.toLowerCase();

      return matchesSearch && matchesCategory && matchesBrand;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, category, brand, products]);

  const handleDelete = async (sku: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${sku}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter(p => p.sku !== sku));
          setFilteredProducts(filteredProducts.filter(p => p.sku !== sku));
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  return (
    <Sidebar>
      {/* 🔹 Header */}
      <h1 className="text-3xl text-white font-bold mb-4 bg-purple-400 p-4 rounded">
        Welcome to Product
      </h1>

      {/* 🔹 Top Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="font-bold text-lg">Product List</h2>
          <h3 className="text-sm text-gray-600">Manage Your Products</h3>
        </div>

        <div className="w-full md:w-1/2 flex justify-end items-center gap-3">
             <button
  onClick={() => exportToExcel(products)}
  className=" border px-4 py-2 rounded"
><FileSpreadsheet size={18} className="bg-green-600" />

</button><button
  onClick={() => exportToPDF(products)}
  className="  border px-4 py-2 rounded ml-2"
><FileText size={18} className="text-red-600" />

</button>  <button
            onClick={() => router.push("/createproduct")}
            className="bg-[var(--accent)] hover:bg-[var(--hover)] rounded h-10 px-4 text-white"
          >
            Add Product
          </button>

          <button className="bg-[var(--accent)] hover:bg-[var(--hover)] rounded h-10 px-4 text-white">
            Import Product
          </button>
     

        </div>
      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-black border-collapse">
          <thead>
            <tr>
              <th colSpan={12}>
                <div className="flex items-center justify-between my-3 gap-4">

                  {/* 🔍 Search */}
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

                  {/* 🎯 Filters */}
                  <div className="flex gap-3">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
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
                      onChange={(e) => setBrand(e.target.value)}
                      className="py-2 px-3 border rounded-md"
                    >
                      <option value="">Brand</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Adidas">Adidas</option>
                      <option value="Nike">Nike</option>
                      <option value="Apple">Apple</option>
                    </select>

                    {/* 🔄 Clear */}
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

            <tr className="bg-[var(--accent)] text-center">
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Brand</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Unit</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Created By</th>
              <th className="px-3 py-2 ">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, index) => (
              <tr
                key={index}
                className="text-center border-b hover:bg-gray-100"
              >
                <td className="px-3 py-2 flex justify-center">
               <img
  src={
    p.image
      ? `http://localhost:5000/uploads/${p.image}`  // backend se
      : "/no-image.png"                             // public folder fallback
  }
  alt={p.name}
  className="w-12 h-12 rounded object-cover"
/>

                </td>
                <td className="px-3 py-2">{p.sku}</td>
                <td className="px-3 py-2 cursor-pointer text-blue-600 hover:underline" onClick={() => router.push(`/createproduct?edit=${p.sku}`)}>{p.name}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">{p.brand}</td>
                <td className="px-3 py-2">{p.price}</td>
                <td className="px-3 py-2">{p.unit}</td>
                <td className="px-3 py-2">{p.qty}</td>
                <td className="px-3 py-2">{p.createdBy}</td>
              <td className="px-3 py-2 w-24">
  <span
    className={`px-2 py-1 rounded text-white ${
      p.status.toLowerCase() === "active"
        ? "bg-green-500"
        : p.status.toLowerCase() === "inactive"
        ? "bg-red-400"
        : "bg-yellow-500"
    }`}
  >
    {p.status}
  </span>
</td>
                <td className="px-3 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => router.push(`/createproduct?edit=${p.sku}`)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit size={18}  />
                  </button>
                  <button
                    onClick={() => handleDelete(p.sku)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => router.push('/createproduct')}
                    className="text-green-500 hover:text-green-700"
                    title="Add"
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
