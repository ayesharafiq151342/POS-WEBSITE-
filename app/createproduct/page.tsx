"use client";
import { useState } from "react";
import Sidebar from "../components/sidebar/page";

export default function CreateProduct() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [productName, setProductName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [slug, setSlug] = useState("");
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const [variants, setVariants] = useState([
    { attribute: "color", value: "", sku: "", quantity: 0, price: 0 },
  ]);

  const generateBarcodeFromName = (name: string): string => {
    const slug = name.toLowerCase().trim().replace(/ /g, "-");
    const random = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `${slug}-${random}`;
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  const plusIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
      <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
    </svg>
  );

  const minusIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
      <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
    </svg>
  );

  const [options, setOptions] = useState([
    "Computer",
    "Electronics",
    "Shoe",
    "Cosmetic"
  ]);

  const addNewItem = () => {
    if (newItem.trim() === "") return;
    setOptions([...options, newItem]);
    setNewItem("");
    setShowPopup(false);
  };

  const handleProductNameChange = (name: string) => {
    setProductName(name);
    setSlug(name.toLowerCase().trim().replace(/ /g, "-"));
    setBarcode(generateBarcodeFromName(name));
  };

  const addVariantRow = () => {
    setVariants([
      ...variants,
      { attribute: "color", value: "", sku: "", quantity: 0, price: 0 },
    ]);
  };

  const removeVariantRow = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const accordionItems = [
    {
      title: "Product Information",
      content: (
        <form
          className="space-y-4 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Form submitted! Backend API integration needed.");
          }}
        >
          {/* Store & Warehouse */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Select Store</label>
              <select className="w-full border  border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option value="">Choose Store</option>
                <option>Electro Mart</option>
                <option>Quantum Gadgets</option>
                <option>Gadget World</option>
                <option>Elite Retail</option>
                <option>Prime Mart</option>
                <option>NeoTech Store</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Warehouse</label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option value="">Choose Store</option>
                <option>Quaint Warehouse</option>
                <option>Traditional Warehouse</option>
                <option>Cool Warehouse</option>
                <option>Nova Storage Hub</option>
                <option>Retail Supply Hub</option>
                <option>EdgeWare Solutions</option>
              </select>
            </div>
          </div>

          {/* Product Name & Slug */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => handleProductNameChange(e.target.value)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Product Name"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 ">Slug</label>
              <input
                type="text"
                value={slug}
                readOnly
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* SKU & Selling Type */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">SKU</label>
              <input
                type="text"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter SKU"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Selling Type</label>
              <select className="w-full border  border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option value="" className="">Select</option>
                <option>Online</option>
                <option>POS</option>
              </select>
            </div>
          </div>

          {/* Category & Subcategory */}
          {/* Category & Subcategory */}
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Category</label>
                <button
                  type="button"
                  onClick={() => setShowPopup(true)}
                  className="bg-[var(--accent)] text-white px-2 py-1 rounded-md text-sm hover:bg-[var(--hover)] transition"
                >
                  + Add New
                </button>
              </div>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option value="">Select Category</option>
                {options.map((opt, i) => (
                  <option key={i} value={opt.toLowerCase()}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Subcategory</label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option value="" >Select Subcategory</option>
                <option>Laptop</option>
                <option>Desktop</option>
                <option>Sneakers</option>
                <option>Formals</option>
                <option>Wearables</option>
              </select>
            </div>
          </div>


          {/* Brand & Unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Brand</label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option value="">Select Brand</option>
                <option>Lenovo</option>
                <option>Nike</option>
                <option>Apple</option>
                <option>Amazon</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Unit</label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option value="">Select Unit</option>
                <option>KG</option>
                <option>Pcs</option>
                <option>L</option>
                <option>dz</option>
                <option>bx</option>
              </select>
            </div>
          </div>

          {/* Barcode */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Barcode Symbology</label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option>Code 128</option>
                <option>Code 39</option>
                <option>UPC-A</option>
                <option>EAN-8</option>
                <option>UPC-E</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Barcode</label>
              <input
                type="text"
                value={barcode}
                readOnly
                className="w-full border rounded-md p-2"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter product description"
              required
            />
          </div>

          <input
            type="submit"
            value="Submit Product"
            className="bg-green-600 text-white px-5 py-2 rounded-md cursor-pointer hover:bg-green-700 transition"
          />

          {/* Add Category Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white p-5 rounded-md shadow-md w-80">
                <h2 className="text-lg font-bold mb-3">Add New Category</h2>
                <input
                  type="text"
                  placeholder="Enter new category"
                  className="border w-full p-2 rounded-md mb-3"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-1 bg-gray-400 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNewItem}
                    className="px-3 py-1 bg-green-600 text-white rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      )
    },
    {
      title: "Pricing & Stocks",
      content: <form
        className="space-y-4 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Form submitted! Backend API integration needed.");
        }}
      >
        {/* HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH */}
        <div className="mt-6 p-3 border-t border-gray-200">
          {/* Mode Selection Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`px-4 py-2 rounded-md font-semibold ${mode === "single"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Single Product
            </button>
            <button
              type="button"
              onClick={() => setMode("multiple")}
              className={`px-4 py-2 rounded-md font-semibold ${mode === "multiple"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Multiple Variants
            </button>
          </div>
{/* Single Product Form */}
{mode === "single" && (
  <div className="mt-4">
    {/* Row 1: Product Type & Quantity */}
    <div className="flex flex-wrap gap-3">
      <div className="flex-1">
        <label className="block font-medium mb-1">Product Type*</label>
        <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Product Type</option>
          <option>Physical</option>
          <option>Digital</option>
          <option>Service</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="block font-medium mb-1">Quantity*</label>
        <input
          type="number"
          min={0}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    {/* Row 2: Price, Tax Type & Tax */}
    <div className="flex flex-wrap gap-3 mt-3">
      <div className="flex-1">
        <label className="block font-medium mb-1">Price*</label>
        <input
          type="number"
          min={0}
          step={0.01}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1">
        <label className="block font-medium mb-1">Tax Type*</label>
        <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          <option value="">Select Tax Type</option>
          <option>Percentage</option>
          <option>Fixed</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="block font-medium mb-1">Tax*</label>
        <input
          type="number"
          min={0}
          step={0.01}
          placeholder="Enter Tax"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>

    {/* Row 3: Discount Type, Discount Value & Quantity Alert */}
    <div className="flex flex-wrap gap-3 mt-3">
      <div className="flex-1">
        <label className="block font-medium mb-1">Discount Type*</label>
        <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          <option value="">Select Discount Type</option>
          <option>Percentage</option>
          <option>Fixed</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="block font-medium mb-1">Discount Value*</label>
        <input
          type="number"
          min={0}
          step={0.01}
          placeholder="Enter Discount"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex-1">
        <label className="block font-medium mb-1">Quantity Alert*</label>
        <input
          type="number"
          min={0}
          placeholder="Enter Quantity Alert"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  </div>
)}

              {/* Multiple Variants Table */}
              {mode === "multiple" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Variant Attributes*</h2>
                  <table className="w-full border border-gray-300 rounded-md">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Variant</th>
                        <th className="border px-2 py-1">Variant Value</th>
                        <th className="border px-2 py-1">SKU</th>
                        <th className="border px-2 py-1">Quantity</th>
                        <th className="border px-2 py-1">Price</th>
                        <th className="border px-2 py-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">
                            <select
                              value={variant.attribute}
                              onChange={(e) =>
                                handleVariantChange(index, "attribute", e.target.value)
                              }
                              className="w-full border rounded-md p-1"
                            >
                              <option value="color">Color</option>
                              <option value="size">Size</option>
                              <option value="material">Material</option>
                            </select>
                          </td>
                          <td className="border px-2 py-1">
                            <input
                              type="text"
                              value={variant.value}
                              onChange={(e) =>
                                handleVariantChange(index, "value", e.target.value)
                              }
                              className="w-full border rounded-md p-1"
                            />
                          </td>
                          <td className="border px-2 py-1">
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) =>
                                handleVariantChange(index, "sku", e.target.value)
                              }
                              className="w-full border rounded-md p-1"
                            />
                          </td>
                          <td className="border px-2 py-1">
                            <input
                              type="number"
                              min={0}
                              value={variant.quantity}
                              onChange={(e) =>
                                handleVariantChange(index, "quantity", Number(e.target.value))
                              }
                              className="w-full border rounded-md p-1"
                            />
                          </td>
                          <td className="border px-2 py-1">
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={variant.price}
                              onChange={(e) =>
                                handleVariantChange(index, "price", Number(e.target.value))
                              }
                              className="w-full border rounded-md p-1"
                            />
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeVariantRow(index)}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              -
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="mt-3 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    + Add Variant
                  </button>
                </div>
              )}
            </div>
  </form>
    },
    {
      title: "What can I do with Material Tailwind?",
      content: "Material Tailwind allows you to quickly build modern, responsive websites with a focus on design."
    }
  ];

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold mb-4 bg-green-200 p-3 rounded">Welcome to Create Product</h1>
      <div className="bg-white w-full rounded-md shadow">
        {accordionItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex bg-[var(--accent)] text-white justify-between items-center py-5 px-3 text-slate-800 hover:bg-[var(--hover)] transition"
            >
              <span>{item.title}</span>
              <span className="transition-transform duration-300">
                {openIndex === index ? minusIcon : plusIcon}
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-[3000px]" : "max-h-0"}`}>
              <div className="pb-5 text-sm text-slate-500 px-3">{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    </Sidebar>
  );
}
