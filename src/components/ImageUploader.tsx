import React, { useState } from "react";

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      onImageChange(file);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-center mb-2">Upload Recipe Image</h3>
      <input
        type="file"
        accept="image/*"
        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUploader;
