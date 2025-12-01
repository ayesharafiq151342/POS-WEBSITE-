import React, { useState } from "react";

export type Warranty = {
  manufacturer: string;
  manufacturedDate: string;
  expiryDate: string;
  warranty: string; // select ke liye string
};

const WarrantySectionWithLabels: React.FC = () => {
  const [warranty, setWarranty] = useState<Warranty>({
    manufacturer: "",
    manufacturedDate: "",
    expiryDate: "",
    warranty: "No", // default
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setWarranty({
      ...warranty,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warranty),
      });
      if (!res.ok) throw new Error("Failed to save warranty");
      alert("Warranty saved successfully!");
      setWarranty({
        manufacturer: "",
        manufacturedDate: "",
        expiryDate: "",
        warranty: "No",
      });
    } catch (err) {
      console.error(err);
      alert("Error saving warranty!");
    }
  };

  return (
    <div className="p-6 bg-white text-slate-500  rounded-lg m-6 max-w-full mx-auto mt-6 ">
   
      <div className="grid grid-cols-4 gap-4 mb-2">
        <label className="font-medium text-slate-500 ">Warranty*</label>
        <label className="font-medium text-slate-500 ">Manufacturer*</label>
        <label className="font-medium text-slate-500 ">Manufactured Date*</label>
        <label className="font-medium text-slate-500 ">Expiry On*</label>
      </div>

      {/* Form Row */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Warranty Select */}
        <div>
          <select
            name="warranty"
            value={warranty.warranty}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Manufacturer */}
        <div>
          <input
            type="text"
            name="manufacturer"
            value={warranty.manufacturer}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
            placeholder="Manufacturer Name"
          />
        </div>

        {/* Manufactured Date */}
        <div>
          <input
            type="date"
            name="manufacturedDate"
            value={warranty.manufacturedDate}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <input
            type="date"
            name="expiryDate"
            value={warranty.expiryDate}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-[var(--accent)] hover:bg-[var(--hover)] text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        Save Warranty
      </button>
    </div>
  );
};

export default WarrantySectionWithLabels;
