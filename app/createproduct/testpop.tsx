import { useState } from "react";
import { Pencil, Upload, X } from "lucide-react";

export default function TestPopup() {
  const [edit_btn, setEdit_btn] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // Form States
  const [barcodeType, setBarcodeType] = useState("EAN-13");
  const [itemCode, setItemCode] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [quantityAlert, setQuantityAlert] = useState<number>(0);
  const [taxType, setTaxType] = useState("Inclusive");
  const [tax, setTax] = useState<number>(0);
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState<number>(0);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Save Variant -> backend ready
  const handleSaveVariant = async () => {
    if (!itemCode) return alert("Item code is required");

    const formData = new FormData();

    if (image) {
      const blob = await fetch(image).then((r) => r.blob());
      formData.append("thumbnail", blob, "variant.png");
    }

    formData.append("barcodeType", barcodeType);
    formData.append("itemCode", itemCode);
    formData.append("quantity", quantity.toString());
    formData.append("quantityAlert", quantityAlert.toString());
    formData.append("taxType", taxType);
    formData.append("tax", tax.toString());
    formData.append("discountType", discountType);
    formData.append("discountValue", discountValue.toString());

    try {
      const res = await fetch("/api/variant", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to save variant");
      alert("Variant saved successfully!");
      setEdit_btn(false); // close popup
      // Optional: reset form
    } catch (err) {
      console.error(err);
      alert("Error saving variant!");
    }
  };

  return (
    <div className="p-0">
      {/* Pencil Button */}
      <button
        type="button"
        onClick={() => setEdit_btn(true)}
        className="text-purple-600 hover:text-purple-800"
      >
        <Pencil size={24} />
      </button>

      {/* Popup */}
      {edit_btn && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg shadow-lg lg:w-96 bg-white">
            <div className="p-6 bg-white rounded-xl shadow-md max-w-96 mx-auto">
              {/* Header */}
              <div className="flex justify-between w-full items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-800">Add Variant</h2>
                <button
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => setEdit_btn(false)}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Thumbnail */}
              <label className="block font-medium mb-1">Variant Thumbnail</label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center mb-5">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md mb-3"
                  />
                ) : (
                  <Upload size={40} className="text-gray-400 mb-2" />
                )}
                <input type="file" onChange={handleImage} className="hidden" id="thumb" />
                <label
                  htmlFor="thumb"
                  className="cursor-pointer px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--hover)]"
                >
                  Add Image
                </label>
                <p className="text-xs text-gray-500 mt-2">JPEG, PNG up to 2 MB</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Barcode Symbology*</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={barcodeType}
                    onChange={(e) => setBarcodeType(e.target.value)}
                    required
                  >
                    <option>EAN-13</option>
                    <option>UPC-A</option>
                    <option>QR</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Item Code*</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Enter item code"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Quantity*</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Quantity Alert*</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={quantityAlert}
                    onChange={(e) => setQuantityAlert(parseInt(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Tax Type*</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    required
                  >
                    <option>Inclusive</option>
                    <option>Exclusive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Tax*</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={tax}
                    onChange={(e) => setTax(parseInt(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Discount Type*</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    required
                  >
                    <option>Percentage</option>
                    <option>Fixed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Discount Value*</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Save Variant */}
              <button
                className="mt-6 w-full bg-[var(--accent)] text-white py-2 rounded-lg hover:bg-[var(--hover)]"
                onClick={handleSaveVariant}
              >
                Save Variant
              </button>

              {/* Cancel / Close */}
              <div className="flex mt-6 justify-end gap-3">
                <button
                  onClick={() => setEdit_btn(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
