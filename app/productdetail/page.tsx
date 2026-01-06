"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

export default function ProductDetail() {
  const searchParams = useSearchParams();
  const sku = searchParams.get("sku");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sku) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        if (res.ok) {
          const data = await res.json();
          const productData = data.find((p: any) => p.sku === sku);

          if (productData) {
            const mappedData: Product = {
              sku: productData.sku || "",
              name: productData.productName || "N/A",
              category: productData.category || "N/A",
              brand: productData.brand || "N/A",
              price: productData.price || 0,
              unit: productData.unit || "N/A",
              qty: productData.quantity || 0,
              createdBy: productData.createdBy || "Admin",
              status: productData.status || "Active",
              image: productData.images?.[0] || null,
            };
            setProduct(mappedData);
          } else {
            alert("Product not found");
          }
        } else {
          alert("Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku]);

  if (loading) {
    return (
      <Sidebar>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </Sidebar>
    );
  }

  if (!product) {
    return (
      <Sidebar>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Product not found</div>
        </div>
      </Sidebar>
    );
  }
return (
  <Sidebar>
    <div className="max-w-6xl mx-auto py-10">

      {/* Top Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Product Details
      </h1>

      <div className="bg-white rounded-xl shadow p-8 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT — Product Gallery */}
        <div>
          {/* Big Image */}
          <div className="bg-gray-100 rounded-xl p-6 shadow-sm mb-4">
            <img
              src={
                product.image
                  ? `http://localhost:3000${product.image}`
                  : "/no-image.png"
              }
              className="w-full h-[450px] object-cover rounded-lg"
              alt={product.name}
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg p-2 cursor-pointer hover:shadow"
              >
                <img
                  src={
                    product.image
                      ? `http://localhost:3000${product.image}`
                      : "/no-image.png"
                  }
                  className="w-full h-24 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Product Info */}
        <div>
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>

          <p className="text-2xl font-semibold text-gray-700 mb-4">
            ${product.price}
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Beautiful premium quality product. Designed with care for comfort and style.
          </p>

          <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.qty}</p>
          </div>

          {/* Status */}
          <span
            className={`px-3 py-1 rounded text-sm text-white ${
              product.status === "Active"
                ? "bg-green-500"
                : "bg-red-400"
            }`}
          >
            {product.status}
          </span>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
              Add to Cart
            </button>

            <button className="border px-6 py-3 rounded-lg hover:bg-gray-100">
              Buy Now
            </button>
          </div>

          {/* Barcode */}
          <div className="mt-8 w-68 border pt-6">
            <img
              src={`https://api-bwipjs.metafloor.com/?bcid=code128&text=${product.sku}&scale=3&includetext`}
              className="h-32 w-64 m-auto "
            />
          </div>

        </div>
      </div>
    </div>
  </Sidebar>
);

}
