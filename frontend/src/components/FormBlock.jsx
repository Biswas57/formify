import { useDrag } from 'react-dnd';

export default function FormBlock({ id, type, index, moveBlock, removeBlock, isTemplate = false }) {
  let fields = [];
  
  // Define fields for each block type
  switch (type) {
    case 'ID':
      fields = ['Name', 'Phone Number', 'Email'];
      break;
    case 'IDExtended':
      fields = ['Name', 'Phone Number', 'Email', 'Address', 'Date of Birth'];
      break;
    case 'Medical':
      fields = ['Allergies', 'Current Medications', 'Medical History'];
      break;
    default:
      fields = ['Field 1', 'Field 2'];
  }

  return (
    <div className={`bg-white rounded-lg border ${isTemplate ? 'border-gray-200' : 'border-blue-200'} p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-blue-600">{type}</h3>
        {!isTemplate && (
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="text-red-400 hover:text-red-600" onClick={removeBlock}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            {field}
          </span>
        ))}
      </div>
    </div>
  );
}