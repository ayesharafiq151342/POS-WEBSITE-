"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../components/sidebar/page";
import { Pencil, Trash } from "lucide-react";
import TestPopup from "./testpop";
// child import

import ImageUpload, { ImageUploadData } from "./imageupload";
import WarrantySectionWithLabels, { Warranty } from "./Custom_Fields";
import DynamicSelect from "./DynamicSelect";
export default function CreateProduct() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [newItem, setNewItem] = useState("");
  const [productName, setProductName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [slug, setSlug] = useState("");
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [submit, setSubmit] = useState(false);
  const [cancel, setCancel] = useState(false);
  const generateBarcodeFromName = (name: string): string => {
    const slug = name.toLowerCase().trim().replace(/ /g, "-");
    const random = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `${slug}-${random}`;
  };
  const [images, setImages] = useState<File[]>([]); // child data store

  const [warrantyData, setWarrantyData] = useState<Warranty | null>(null);
  type Variant = {
    attribute: string;
    value: string;
    sku: string;
    quantity: number;
    price: number;
  };
  const [options, setOptions] = useState<string[]>(["Computer", "Electronics"]);
  const [showPopup, setShowPopup] = useState(false);

  const [sku, setSku] = useState("");

  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [taxType, setTaxType] = useState("");
  const [tax, setTax] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [quantityAlert, setQuantityAlert] = useState(0);
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [units, setUnits] = useState(["KG", "Pcs"]);

  const searchParams = useSearchParams();
  const editSku = searchParams.get('edit');
  const [optionss, setOptionss] = useState([
    "KG",
    "Pcs",
    "L",
    "dz",
    "bx",
    "piece",
  ]);
  const [newOption, setNewOption] = useState("");


  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sellingType, setSellingType] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [store, setStore] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [barcodeSymbology, setBarcodeSymbology] = useState("");
  // Load product data for editing
  // Options arrays
  const [unitOptions, setUnitOptions] = useState(["Kg", "Litre", "Piece"]);
  const [categoryOptions, setCategoryOptions] = useState(["Electronics", "Clothing"]);
  const [brandOptions, setBrandOptions] = useState(["Lenovo", "Nike", "Apple", "Amazon"]);
  const [sellingTypeOptions, setSellingTypeOptions] = useState(["Online", "POS"]);
  const [subcategoryOptions, setSubcategoryOptions] = useState(["Laptop", "Desktop", "Sneakers", "Formals", "Wearables"]);
  const [storeOptions, setStoreOptions] = useState(["Electro Mart", "Quantum Gadgets", "Gadget World"]);
  const [warehouseOptions, setWarehouseOptions] = useState(["Quaint Warehouse", "Cool Warehouse", "Nova Storage Hub"]);
  const [barcodeSymbologyOptions, setBarcodeSymbologyOptions] = useState(["Code 128", "Code 39", "UPC-A", "EAN-8", "UPC-E"]);

  useEffect(() => {
    if (editSku) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${editSku}`)
        .then((res) => res.json())
        .then((product) => {
          if (product) {
            setProductName(product.productName || "");
            setSlug(product.slug || "");
            setBarcode(product.barcode || "");
            setStore(product.store || "");
            setWarehouse(product.warehouse || "");
            setSku(product.sku || "");
            setSellingType(product.sellingType || "");
            setCategory(product.category || "");
            setSubcategory(product.subcategory || "");
            setBrand(product.brand || "");
            setUnit(product.unit || "");
            setBarcodeSymbology(product.barcodeSymbology || "Code 128");
            setDescription(product.description || "");
            setProductType(product.productType || "");
            setQuantity(product.quantity || 0);
            setPrice(product.price || 0);
            setTaxType(product.taxType || "");
            setTax(product.tax || 0);
            setDiscountType(product.discountType || "");
            setDiscountValue(product.discountValue || 0);
            setQuantityAlert(product.quantityAlert || 0);
            setManufactureDate(product.manufactureDate ? product.manufactureDate.split('T')[0] : "");
            setExpiryDate(product.expiryDate ? product.expiryDate.split('T')[0] : "");
          }
        })
        .catch((err) => console.error("Error loading product for edit:", err));
    }
  }, [editSku]);

  const handleAddCategory = () => {
    if (newItem && !options.includes(newItem)) {
      setOptions([...options, newItem]);
      setCategory(newItem.toLowerCase());
      setNewItem("");
      setShowPopup(false);
    }
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


  const editVariantRow = (index: number) => {
    // Logic to edit variant row can be implemented here
    alert(`Edit functionality for row ${index + 1} is not implemented yet.`);
  }


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
    field: keyof Variant,
    value: string | number
  ) => {
    const newVariants = [...variants];
    if (field === 'quantity' || field === 'price') {
      newVariants[index][field] = value as number;
    } else {
      newVariants[index][field] = value as string;
    }
    setVariants(newVariants);
  };

  const handleSubmit = async () => {
    setSubmit(true);
    console.log("Submitting warranty data:", warrantyData);

    if (!warrantyData) {
      alert("Please fill warranty data first!");
      return;
    }

    let imageUrls: string[] = [];

    // 1️⃣ Upload images first
    if (images.length > 0) {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));

      try {
        const resImages = await fetch(`http://localhost:5000/upload`, {
          method: "POST",
          body: formData,
        });
        if (!resImages.ok) throw new Error("Upload failed");
        const data = await resImages.json();
        imageUrls = data.urls || [];
        alert("Images uploaded successfully!");
        setImages([]);
      } catch (err) {
        console.error(err);
        alert("Upload error!");
        return;
      }
    }

    // 2️⃣ Save warranty data
    try {
      const resWarranty = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/warranty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warrantyData),
      });
      if (!resWarranty.ok) throw new Error("Failed to save warranty data");
      alert("Warranty data saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving warranty!");
      return;
    }

    // 3️⃣ Collect product data
    const productData = {
      productName,
      slug,
      barcode,
      store,
      warehouse,
      sku,
      sellingType,
      category,
      subcategory,
      brand,
      unit,
      barcodeSymbology,
      description,
      productType,
      quantity,
      price,
      taxType,
      tax,
      discountType,
      discountValue,
      quantityAlert,
      manufactureDate,
      expiryDate,
      images: imageUrls,
      warranty: warrantyData,
      mode,
      variants: mode === 'multiple' ? variants : [],
    };

    // 4️⃣ Send to /api/products
    try {
      const method = editSku ? "PUT" : "POST";
      const url = editSku ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${editSku}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;
      const resProduct = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!resProduct.ok) throw new Error("Failed to save product");
      alert(editSku ? "Product updated successfully!" : "Product saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving product!");
    }
  }; useEffect(() => {
    if (editSku) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${editSku}`)
        .then((res) => res.json())
        .then((product) => {
          if (product) {
            setProductName(product.productName || "");
            setSlug(product.slug || "");
            setBarcode(product.barcode || "");
            setStore(product.store || "");
            setWarehouse(product.warehouse || "");
            setSku(product.sku || "");
            setSellingType(product.sellingType || "");
            setCategory(product.category || "");
            setSubcategory(product.subcategory || "");
            setBrand(product.brand || "");
            setUnit(product.unit || "");
            setBarcodeSymbology(product.barcodeSymbology || "Code 128");
            setDescription(product.description || "");
            setProductType(product.productType || "");
            setQuantity(product.quantity || 0);
            setPrice(product.price || 0);
            setTaxType(product.taxType || "");
            setTax(product.tax || 0);
            setDiscountType(product.discountType || "");
            setDiscountValue(product.discountValue || 0);
            setQuantityAlert(product.quantityAlert || 0);
            setManufactureDate(product.manufactureDate ? product.manufactureDate.split('T')[0] : "");
            setExpiryDate(product.expiryDate ? product.expiryDate.split('T')[0] : "");
          }
        })
        .catch((err) => console.error("Error loading product for edit:", err));
    }
  }, [editSku]);


  const handleCancel = () => {
    setCancel(true);
    console.log("Cancel clicked"); // state update async, ye just confirmation
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
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter SKU"
                required
              />
            </div>
            <div className="flex-1">
              {/* Selling Type */}
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

          {/* Category & Subcategory */}
          {/* Category & Subcategory */}
          <div className="flex gap-3">
            <div className="flex-1">
             {/* Category */}
      <DynamicSelect
        label="Category"
        value={category}
        onChange={setCategory}
        options={categoryOptions}
        onAddOption={(val) => setCategoryOptions([...categoryOptions, val])}
      />

            </div>
            <div className="flex-1">
              <DynamicSelect
                label="Subcategory"
                value={subcategory}
                onChange={setSubcategory}
                options={subcategoryOptions}
                onAddOption={(val) => setSubcategoryOptions([...subcategoryOptions, val])}
              />

            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <DynamicSelect
                label="Store"
                value={store}
                onChange={setStore}
                options={storeOptions}
                onAddOption={(val) => setStoreOptions([...storeOptions, val])}
              />
            </div>
            <div className="flex-1">
              <DynamicSelect
                label="Warehouse"
                value={warehouse}
                onChange={setWarehouse}
                options={warehouseOptions}
                onAddOption={(val) => setWarehouseOptions([...warehouseOptions, val])}
              />
            </div>
          </div>

          {/* Brand & Unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              {/* Brand Select */}
              <DynamicSelect
                label="Brand"
                value={brand}
                onChange={setBrand}
                options={brandOptions}
                onAddOption={(val) => setBrandOptions([...brandOptions, val])}
              />
            </div>
            <div className="flex-1">

              <DynamicSelect
                label="Unit"
                value={unit}
                onChange={setUnit}
                options={units}
                onAddOption={(newUnit) => setUnits([...units, newUnit])}
              />      </div>
          </div>

          {/* Barcode */}
          <div className="flex gap-3">
            <div className="flex-1">
              <DynamicSelect
                label="Barcode Symbology"
                value={barcodeSymbology}
                onChange={setBarcodeSymbology}
                options={barcodeSymbologyOptions}
                onAddOption={(val) => setBarcodeSymbologyOptions([...barcodeSymbologyOptions, val])}
              />

            </div>
            <div className="flex-1">
              <DynamicSelect
                label="Selling Type"
                value={sellingType}
                onChange={setSellingType}
                options={sellingTypeOptions}
                onAddOption={(val) => setSellingTypeOptions([...sellingTypeOptions, val])}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Manufacture Date & Expiry Date */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Manufacture Date</label>
              <input
                type="date"
                value={manufactureDate}
                onChange={(e) => setManufactureDate(e.target.value)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>



          {/* Add Category Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center">
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
                    onClick={handleAddCategory}
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
                ? "bg-[var(--accent)] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Single Product
            </button>
            <button
              type="button"
              onClick={() => setMode("multiple")}
              className={`px-4 py-2 rounded-md font-semibold ${mode === "multiple"
                ? "bg-[var(--accent)] text-white"
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
                  <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
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
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="block font-medium mb-1">Tax Type*</label>
                  <select value={taxType} onChange={(e) => setTaxType(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
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
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
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
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
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
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
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
                    value={quantityAlert}
                    onChange={(e) => setQuantityAlert(Number(e.target.value))}
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
              <table className="w-full   rounded-md">
                <thead className="bg-[var(--accent)] text-white">
                  <tr>
                    <th className="  px-2 py-1">Variant</th>
                    <th className=" px-2 py-1">Variant Value</th>
                    <th className=" px-2 py-1">SKU</th>
                    <th className=" px-2 py-1">Quantity</th>
                    <th className=" px-2 py-1">Price</th>
                    <th className=" px-2 py-1">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, index) => (
                    <tr key={index}>
                      <td className="px-2 py-1">
                        <select
                          value={variant.attribute}
                          onChange={(e) =>
                            handleVariantChange(index, "attribute", e.target.value)
                          }
                          className="w-full  outline rounded focus:ring-0 p-1 bg-white"
                        >
                          <option value="color">Color</option>
                          <option value="size">Size</option>
                          <option value="material">Material</option>
                        </select>
                      </td>

                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={variant.value}
                          onChange={(e) =>
                            handleVariantChange(index, "value", e.target.value)
                          }
                          className="w-full  outline rounded focus:ring-0 p-1 bg-white"
                        />
                      </td>

                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) =>
                            handleVariantChange(index, "sku", e.target.value)
                          }
                          className="w-full  outline rounded focus:ring-0 p-1 bg-white"
                        />
                      </td>

                      <td className="px-2 py-1">
                        <input
                          type="number"
                          min={0}
                          value={variant.quantity}
                          onChange={(e) =>
                            handleVariantChange(index, "quantity", Number(e.target.value))
                          }
                          className="w-full  outline rounded focus:ring-0 p-1 bg-white"
                        />
                      </td>

                      <td className="px-2 py-1">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", Number(e.target.value))
                          }
                          className="w-full outline rounded focus:ring-0 p-1 bg-white"
                        />
                      </td>

                      <td className=" px-2 py-1  outline rounded text-center">
                        <div className="flex gap-3">

                          <div className="flex gap-3">
                            {/* Edit Button */}
                            <TestPopup />

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => removeVariantRow(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addVariantRow}
                className="mt-3 px-3 py-1 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--hover)] transition"
              >
                + Add Variant
              </button>
            </div>
          )}
        </div>
      </form>
    },
    {
      title: "Images",
      content: (<>
        <ImageUpload onChange={setImages} images={images} />
      </>),
    }, {
      title: "Custom Fields",
      content:
        <WarrantySectionWithLabels onChange={setWarrantyData} />
    }
  ];

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold mb-4 bg-[var(--accent)] text-white p-3 rounded">Welcome to {editSku ? 'Edit' : 'Create'} Product</h1>
      <div className="bg-white  w-full rounded-md shadow">
        {accordionItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex font-bold text-black  justify-between items-center py-5 px-3 text-slate-800  transition"
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
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-[var(--accent)] hover:bg-[var(--hover)] text-white rounded w-32 h-10 mt-5 transition-colors"
      >
        {editSku ? 'Update' : 'Submit'}
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className="bg-[var(--danger)] hover:bg-[var(--hover_danger)] text-white rounded w-32 h-10 mt-5 ml-4 "
      >
        Cancel
      </button>

    </Sidebar>
  );
}
