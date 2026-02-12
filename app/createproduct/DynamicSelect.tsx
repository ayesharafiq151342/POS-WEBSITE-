import { useState } from "react";

type DynamicSelectProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  onAddOption?: (val: string) => void; // callback for adding new option
  required?: boolean;
};

export default function DynamicSelect({
  label,
  value,
  onChange,
  options,
  onAddOption,
  required = false,
}: DynamicSelectProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [newOption, setNewOption] = useState("");

  const handleAdd = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      onAddOption?.(trimmed); // Add to parent options
      onChange(trimmed);       // Automatically select new option
      setNewOption("");        // Clear input
      setShowPopup(false);     // Close popup
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label & Add Button */}
      <div className="flex justify-between items-center mb-1">
        <label className="block font-medium">{label}</label>
        {onAddOption && (
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="bg-[var(--accent)] text-white px-2 py-1 rounded-md text-sm hover:bg-[var(--hover)] transition"
          >
            + Add New
          </button>
        )}
      </div>

      {/* Select */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-md shadow-md w-80">
            <h2 className="text-lg font-bold mb-3">Add New {label}</h2>
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder={`Enter new ${label}`}
              className="border w-full p-2 rounded-md mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1 bg-green-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
