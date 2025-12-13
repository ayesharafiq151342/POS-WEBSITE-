"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/page";
import { useRouter } from "next/navigation";
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
  const [searchQuery, setSearchQuery] = useState("");
   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState([
    {
      sku: "SKU001",
      name: "Product A",
      category: "Category 1",
      brand: "Brand X",
      price: 100,
      unit: "Piece",
      qty: 10,
      createdBy: "Admin",
      status: "Active",
      image: "product1.jpg",
    }, {
      sku: "SKU002",
      name: "Product A",
      category: "Category 1",
      brand: " y",
      price: 100,
      unit: "Piece",
      qty: 10,
      createdBy: "Admin",
      status: "Active",
      image: "product1.jpg",
    },
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);
 useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);
  return (
    <Sidebar>
      
      <h1 className="text-3xl font-bold mb-4 bg-green-200 p-4 rounded">
        Welcome to Product
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="font-bold text-lg">Product List</h2>
          <h3 className="text-sm text-gray-600">Manage Your Products</h3>
        </div>

        <div className="w-full md:w-1/2 flex justify-start md:justify-end items-center">
          <div className="flex gap-3">
            <button 
       onClick={() => router.push("/createproduct")}   className="bg-[var(--accent)] hover:bg-[var(--hover)] rounded h-10 px-4 text-white">
             
              Add Product
            </button>
            <button className="bg-[var(--accent)] hover:bg-[var(--hover)] rounded h-10 px-4 text-white">
       Import Product
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-black border-collapse">
          <thead> <tr>
    <th colSpan={9}>
    <div className="relative w-64 mx-auto my-2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search Products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

    </th> </tr>
            <tr className="bg-[var(--accent)] text-center">
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Product Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Brand</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Unit</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Created By</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, index) => (
              <tr key={index} className="text-center border-b hover:bg-gray-100">
                <td className="px-3 py-2 flex justify-center">
                  <img
                    src={
                      p.image
                        ? `http://localhost:5000/uploads/${p.image}`
                        : "/no-image.png"
                    }
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td className="px-3 py-2">{p.sku}</td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">{p.brand}</td>
                <td className="px-3 py-2">{p.price}</td>
                <td className="px-3 py-2">{p.unit}</td>
                <td className="px-3 py-2">{p.qty}</td>
                <td className="px-3 py-2">{p.createdBy}</td>
                <td className="px-3 py-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Sidebar>
  );
}
