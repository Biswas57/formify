import React from "react";
import { blocksConfig } from "../blocksConfig";

export default function FormBlock({
  id,
  type,
  index,
  removeBlock,
  isTemplate = false,
  withDelete = true,
}) {
  const block = blocksConfig[type] || { label: type, fields: ["Field 1", "Field 2"] };

  return (
    <div
      className={`bg-white rounded-lg border ${
        isTemplate ? "border-gray-200" : "border-blue-200"
      } p-4 mb-4`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-blue-600">{block.label}</h3>
        {/* Only render internal delete if withDelete is true */}
        {!isTemplate && withDelete && (
          <button
            className="text-red-400 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              removeBlock();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {block.fields.map((field, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
          >
            {field}
          </span>
        ))}
      </div>
    </div>
  );
}
