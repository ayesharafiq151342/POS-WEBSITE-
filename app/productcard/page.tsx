"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar/page";

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

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold mb-6">Product List</h1>

      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <div
            key={p.sku}
            className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            {/* Left: Barcode */}
            <div className="flex flex-col items-center justify-center w-24">
              <img
                src={`https://barcode.tec-it.com/barcode.ashx?data=${p.sku}&code=Code128&translate-esc=true`}
                alt={`Barcode ${p.sku}`}
                className="w-full h-16 object-contain"
              />
              <span className="text-sm mt-1">{p.sku}</span>
            </div>

            {/* Center: Product Details */}
            <div className="flex-1 px-4">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-gray-600">
                Category: {p.category} | Brand: {p.brand}
              </p>
              <p className="text-gray-600">
                Price: ${p.price} | Qty: {p.qty} | Unit: {p.unit}
              </p>
              <p className="text-gray-500">Created By: {p.createdBy}</p>
              <p
                // className={`inline-block mt-1 px-2 py-1 rounded text-white ${
                //   p.status.toLowerCase() === "active"
                //     ? "bg-green-500"
                //     : p.status.toLowerCase() === "inactive"
                //     ? "bg-red-400"
                //     : "bg-yellow-500"
                // }`}
              >
                {p.status}
              </p>
            </div>

            {/* Right: Product Image */}
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={p.image ? `http://localhost:5000${p.image}` : "/no-image.png"}
                alt={p.name}
                className="w-full h-full object-cover rounded-lg border"
              />
            </div>
          </div>
        ))}
      </div>
    </Sidebar>
  );
}
