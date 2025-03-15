export default function FormPreview({ blocks }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 pb-4 border-b">Form Preview</h2>
      
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'ID':
            return (
              <div key={index} className="mb-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="John Doe" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full p-2 border border-gray-300 rounded-md" placeholder="(123) 456-7890" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="w-full p-2 border border-gray-300 rounded-md" placeholder="john@example.com" />
                </div>
              </div>
            );
          case 'IDExtended':
            return (
              <div key={index} className="mb-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="John Doe" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full p-2 border border-gray-300 rounded-md" placeholder="(123) 456-7890" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="w-full p-2 border border-gray-300 rounded-md" placeholder="john@example.com" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="123 Main St, City, State" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>
            );
          case 'Medical':
            return (
              <div key={index} className="mb-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="2" placeholder="List any allergies..."></textarea>
                </div>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                  <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="2" placeholder="List current medications..."></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                  <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="3" placeholder="Please describe your medical history..."></textarea>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
      
      {blocks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Drag and drop form blocks to start building your form</p>
        </div>
      )}
    </div>
  );
}

