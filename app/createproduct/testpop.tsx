import { useState } from "react";
import { Pencil  ,Upload, X } from "lucide-react";
export default function TestPopup() {

  const [edit_btn, setEdit_btn] = useState(false);
const [image, setImage] = useState<string | null>(null);


 const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImage(URL.createObjectURL(file));
  }
};

  return (
    <div className="p-0">

      {/* Pencil Button */}
      <button
        type="button"
        onClick={() => {
          console.log("Pencil Clicked");
          setEdit_btn(true);
        }}
        className="text-purple-600 hover:text-purple-800"
      >
        <Pencil size={24} />
      </button>

      {/* POPUP */}
      {edit_btn && (
        <div className="fixed inset-0 bg-transpatent bg-opacity-50 flex  items-center justify-center z-50">
          <div className=" p-6 rounded-lg shadow-lg lg:w-96 bg-white">
         <div className="p-6 bg-white rounded-xl shadow-md max-w-96 mx-auto">
      {/* Header */}
      <div className="flex justify-between w-full items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Add Variant</h2>
        <button className="text-gray-500 hover:text-red-600">
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
        
        {/* Barcode */}
        <div>
          <label className="block font-medium mb-1">Barcode Symbology*</label>
          <select className="w-full border rounded-md p-2"  required>
            <option>Select Type</option>
            <option>EAN-13</option>
            <option>UPC-A</option>
            <option>QR</option>
          </select>
        </div>

        {/* Item Code */}
        <div>
          <label className="block font-medium mb-1">Item Code*</label>
          <input
            type="text"
            className="w-full border rounded-md p-2"
            placeholder="Enter item code" required
          />
        </div>

        {/* Quantity */}
        <div>
          <label    className="block font-medium mb-1" >Quantity*</label>
          <input  required type="number" className="w-full border rounded-md p-2" />
        </div>

        {/* Quantity Alert */}
        <div>
          <label className="block font-medium mb-1">Quantity Alert*</label>
          <input  required type="number" className="w-full border rounded-md p-2" />
        </div>

        {/* Tax Type */}
        <div>
          <label className="block font-medium mb-1">Tax Type*</label>
          <select className="w-full border rounded-md p-2"  required>
            <option>Select</option>
            <option>Inclusive</option>
            <option>Exclusive</option>
          </select>
        </div>

        {/* Tax */}
        <div>
          <label className="block font-medium mb-1">Tax*</label>
          <input type="number"  required className="w-full border rounded-md p-2" />
        </div>

        {/* Discount Type */}
        <div>
          <label className="block font-medium mb-1">Discount Type*</label>
          <select className="w-full border rounded-md p-2" required>
            <option>Select</option>
            <option>Percentage</option>
            <option>Fixed</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label className="block font-medium mb-1">Discount Value*</label>
          <input   required type="number" className="w-full border rounded-md p-2" />
        </div>

      </div>

      {/* Submit */}
      <button className="mt-6 w-full bg-[var(--accent)] text-white py-2 rounded-lg hover:bg-[var(--hover)]">
        Save Variant
      </button>
    </div>
            <div className="flex mt-6 justify-end gap-3">
              <button
                onClick={() => setEdit_btn(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => setEdit_btn(false)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
