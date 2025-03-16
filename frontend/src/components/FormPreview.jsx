import { motion, AnimatePresence } from "framer-motion";
import { blocksConfig } from "../blocksConfig";

// Helper to render an input field based on the field name
const renderField = (fieldName) => {
  if (["Medical History", "Allergies", "Current Medications"].includes(fieldName)) {
    return (
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md"
        rows="3"
        placeholder={`Enter ${fieldName}...`}
      />
    );
  } else if (fieldName === "Date of Birth") {
    return (
      <input
        type="date"
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    );
  } else {
    return (
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder={`Enter ${fieldName}...`}
      />
    );
  }
};

export default function FormPreview({ blocks }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 pb-4 border-b">Form Preview</h2>

      <AnimatePresence>
        {blocks.map((block) => {
          // Use block.block_name to look up configuration in blocksConfig.
          // Fallback to block.type or a default configuration.
          const blockConfig =
            blocksConfig[block.block_name] ||
            blocksConfig[block.type] ||
            { label: block.type, fields: ["Field 1", "Field 2"] };

          return (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {blockConfig.label || block.block_name || block.type}
              </h3>

              {blockConfig.fields.map((field, idx) => {
                // Determine field name: if field is an object, use its field_name property; otherwise use the string directly.
                const fieldName =
                  typeof field === "object" && field.field_name ? field.field_name : field;
                return (
                  <div key={idx} className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {fieldName}
                    </label>
                    {renderField(fieldName)}
                  </div>
                );
              })}
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
          <p>Click template blocks to start building your form</p>
        </div>
      )}
    </div>
  );
}
