import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormBlock from '../components/FormBlock';
import FormPreview from '../components/FormPreview';

export default function FormCreate() {
  const navigate = useNavigate();
  const [formName, setFormName] = useState('');
  const [formBlocks, setFormBlocks] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  
  // Sample template blocks
  const templateBlocks = [
    { id: 'template-1', type: 'ID' },
    { id: 'template-2', type: 'IDExtended' },
    { id: 'template-3', type: 'Medical' }
  ];
  
  // Handle dropping a template block into the form
  const handleDrop = (blockType) => {
    const newBlock = {
      id: `block-${formBlocks.length + 1}`,
      type: blockType
    };
    
    setFormBlocks([...formBlocks, newBlock]);
  };
  
  // Handle moving a block within the form
  const moveBlock = (dragIndex, hoverIndex) => {
    const newBlocks = [...formBlocks];
    const draggedBlock = newBlocks[dragIndex];
    
    // Remove the dragged item
    newBlocks.splice(dragIndex, 1);
    // Insert it at the new position
    newBlocks.splice(hoverIndex, 0, draggedBlock);
    
    setFormBlocks(newBlocks);
  };
  
  // Handle removing a block from the form
  const removeBlock = (index) => {
    const newBlocks = [...formBlocks];
    newBlocks.splice(index, 1);
    setFormBlocks(newBlocks);
  };
  
  // Handle saving the form
  const handleSave = async () => {
    const form = {
      name: formName || 'Untitled Form',
      blocks: formBlocks
    };
    
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('http://localhost:8000/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authentication token if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      const savedForm = await response.json();
      console.log('Form saved successfully:', savedForm);
      
      // Navigate to MyForms page after successful save
      navigate('/dashboard/myforms');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form. Please try again.');
    }
  };
  
  // Simulate drag and drop
  const handleAddBlock = (blockType) => {
    const newBlock = {
      id: `block-${formBlocks.length + 1}`,
      type: blockType
    };
    
    setFormBlocks([...formBlocks, newBlock]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Form</h1>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Form
        </button>
      </div>
      
      <div className="mb-6">
        <label htmlFor="formName" className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
        <input 
          type="text" 
          id="formName" 
          value={formName} 
          onChange={(e) => setFormName(e.target.value)} 
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md" 
          placeholder="Enter form name..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Form Preview Section */}
        <div className="lg:col-span-2">
          <FormPreview blocks={formBlocks} />
        </div>
        
        {/* Form Building Section */}
        <div className="space-y-6">
          {/* Arrangement Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Form Structure</h2>
            
            <div className="form-blocks space-y-2 min-h-36">
              {formBlocks.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400">
                  <p>Drag blocks here to build your form</p>
                </div>
              ) : (
                formBlocks.map((block, index) => (
                  <div key={block.id} className="relative">
                    <FormBlock 
                      id={block.id} 
                      type={block.type} 
                      index={index}
                      removeBlock={() => removeBlock(index)}
                      moveBlock={moveBlock}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Template Blocks Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Template Blocks</h2>
            
            <div className="space-y-3">
              {templateBlocks.map((block) => (
                <div 
                  key={block.id} 
                  className="cursor-pointer" 
                  onClick={() => handleAddBlock(block.type)}
                >
                  <FormBlock 
                    id={block.id} 
                    type={block.type}
                    isTemplate={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
