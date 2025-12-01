import React, { useState } from "react";

const ImageUpload = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const selectedFiles: File[] = [];
    const selectedPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (!validTypes.includes(files[i].type)) {
        alert(`Invalid file type: ${files[i].name}`);
        continue;
      }
      selectedFiles.push(files[i]);
      selectedPreviews.push(URL.createObjectURL(files[i]));
    }

    setImages([...images, ...selectedFiles]);
    setPreviewUrls([...previewUrls, ...selectedPreviews]);
  };

  const handleRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      alert("Images uploaded successfully!");
      setImages([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error(err);
      alert("Upload error!");
    }
  };

  return (
    <div className="min-h-54 flex justify-start items-start p-6 ">
      {/* Left aligned card */}
      <div className="p-6 w-full max-w-lg bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Images</h2>

        <label className="block mb-4 cursor-pointer">
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <span className="text-gray-400">Click or Drag & Drop images here</span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative w-full pb-full rounded-lg overflow-hidden shadow-sm">
              <img
                src={url}
                alt="preview"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[var(--accent)] hover:bg-[var(--hover)] text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Upload Images
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
