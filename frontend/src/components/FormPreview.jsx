import { motion, AnimatePresence } from "framer-motion";
import { blocksConfig } from "../blocksConfig";

// Helper to render a preview field based on the field name
const renderField = (field) => {
  const baseStyles = "w-full p-2 bg-gray-50 border border-dashed border-gray-300 rounded-md text-gray-400 cursor-not-allowed select-none";
  
  if (["Medical History", "Allergies", "Current Medications"].includes(field)) {
    return (
      <div 
        className={`${baseStyles} h-24`}
        aria-label={`Preview area for ${field}`}
      >
        {field} text area
      </div>
    );
  } else if (field === "Date of Birth") {
    return (
      <div 
        className={baseStyles}
        aria-label="Preview area for date input"
      >
        Date picker
      </div>
    );
  } else {
    return (
      <div 
        className={baseStyles}
        aria-label={`Preview area for ${field}`}
      >
        {field} input field
      </div>
    );
  }
};

export default function FormPreview({ blocks }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h2 className="text-xl font-semibold">Form Preview</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Preview Mode</span>
      </div>

      <AnimatePresence>
        {blocks.map((block) => {
          // Get the configuration for this block type. Fallback to a default if not found.
          const blockConfig =
            blocksConfig[block.type] || { label: block.type, fields: ["Field 1", "Field 2"] };

          return (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {blockConfig.label}
              </h3>

              {blockConfig.fields.map((field, idx) => (
                <div key={idx} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Drag and drop form blocks to start building your form</p>
          <p className="text-sm mt-2 text-gray-500">This is a preview of the form structure. It cannot be edited.</p>
        </div>
      )}
    </div>
  );
}
