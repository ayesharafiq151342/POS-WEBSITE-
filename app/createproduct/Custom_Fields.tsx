// WarrantySectionWithLabels.tsx
import React, { useState, useEffect } from "react";

export type Warranty = {
  manufacturer: string;
  manufacturedDate: string;
  expiryDate: string;
  warranty: string;
};

type Props = {
  onChange: (data: Warranty) => void;
};

const WarrantySectionWithLabels: React.FC<Props> = ({ onChange }) => {
  const [warranty, setWarranty] = useState<Warranty>({
    manufacturer: "",
    manufacturedDate: "",
    expiryDate: "",
    warranty: "No",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedWarranty = { ...warranty, [name]: value };
    setWarranty(updatedWarranty);
    onChange(updatedWarranty); // send data to parent
  };

  return (
    <div className="p-6 bg-white rounded-lg m-6">
      <div className="grid grid-cols-4 gap-4 mb-2">
        <label>Warranty*</label>
        <label>Manufacturer*</label>
        <label>Manufactured Date*</label>
        <label>Expiry On*</label>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <select name="warranty" value={warranty.warranty} onChange={handleChange} className="border p-2 w-full">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            name="manufacturer"
            value={warranty.manufacturer}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Manufacturer Name"
          />
        </div>

        <div>
          <input
            type="date"
            name="manufacturedDate"
            value={warranty.manufacturedDate}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <input
            type="date"
            name="expiryDate"
            value={warranty.expiryDate}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default WarrantySectionWithLabels;
