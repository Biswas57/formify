import { useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const renderField = (fieldType, value = "") => {
  if (fieldType === "textarea") {
    return (
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md"
        rows="3"
        placeholder="Enter here..."
        defaultValue={value}
      />
    );
  } else if (fieldType === "date") {
    return (
      <input
        type="date"
        className="w-full p-2 border border-gray-300 rounded-md"
        defaultValue={value}
      />
    );
  } else {
    return (
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Enter here..."
        defaultValue={value}
      />
    );
  }
};

export default function FilledForm() {
  const { formId } = useParams();
  const location = useLocation();
  const extractedFields = location.state?.extractedFields || [];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Auto-Filled Form</h1>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b">Form Fields</h2>

        <AnimatePresence>
          {extractedFields.length > 0 ? (
            extractedFields.map((block, blockIndex) => (
              <motion.div
                key={blockIndex}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{block.block_name}</h3>

                {block.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.field_name}
                    </label>
                    {renderField(field.field_type, field.value)}
                  </div>
                ))}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500">No fields detected.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
