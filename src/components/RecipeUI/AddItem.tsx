import React, { useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";

interface AddItemProps {
  label: string;
  itemList: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
}

const AddItem: React.FC<AddItemProps> = ({
  label,
  itemList,
  onAdd,
  onRemove,
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim() !== "" && !itemList.includes(newItem.trim())) {
      onAdd(newItem.trim());
      setNewItem("");
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-center mb-2">{label}</h3>
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Enter one ${label.toLowerCase()}`}
          className="w-full p-3 pl-5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <Button
          type="button"
          icon="/plus.svg"
          title={`Add ${label}`}
          variant="btn_small_gradient sm: pr-10"
          onClick={handleAdd}
        />
      </div>

      {/* Display Added Items */}
      {itemList.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {itemList.map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-4 py-2 rounded-lg"
            >
              <span className="text-sm">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
              >
                <Image
                  src="/close.svg"
                  alt="close-icon"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddItem;
