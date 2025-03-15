import React, { useState } from "react";
import FormBlock from "../components/FormBlock";
import FormPreview from "../components/FormPreview";
import SortableItem from "../components/SortableItem";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { blocksConfig } from "../blocksConfig";

export default function FormCreate() {
  const [formName, setFormName] = useState("");
  const [formBlocks, setFormBlocks] = useState([]);

  // You can choose to display all block types as templates,
  // or define a custom list:
  const templateBlocks = Object.keys(blocksConfig).map((type, index) => ({
    id: `template-${index + 1}`,
    type,
  }));

  // Add a template block into the form
  const handleAddBlock = (blockType) => {
    const newBlock = {
      id: `block-${formBlocks.length + 1}`,
      type: blockType,
    };
    setFormBlocks([...formBlocks, newBlock]);
  };

  // Update order when dragging ends
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = formBlocks.findIndex((block) => block.id === active.id);
      const newIndex = formBlocks.findIndex((block) => block.id === over.id);
      setFormBlocks(arrayMove(formBlocks, oldIndex, newIndex));
    }
  };

  // Remove a block
  const removeBlock = (index) => {
    const newBlocks = [...formBlocks];
    newBlocks.splice(index, 1);
    setFormBlocks(newBlocks);
  };

  // Save the form
  const handleSave = () => {
    const form = {
      name: formName || "Untitled Form",
      blocks: formBlocks,
    };
    console.log("Saving form:", form);
    alert("Form saved successfully!");
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Form</h1>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save Form
        </button>
      </div>

      {/* Form Name */}
      <div className="mb-6">
        <label
          htmlFor="formName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Form Name
        </label>
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
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Form Structure
            </h2>
            <div className="form-blocks space-y-2 min-h-36">
              {formBlocks.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400">
                  <p>Drag blocks here to build your form</p>
                </div>
              ) : (
                <DndContext
                  onDragEnd={handleDragEnd}
                  collisionDetection={closestCenter}
                >
                  <SortableContext
                    items={formBlocks.map((block) => block.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {formBlocks.map((block, index) => (
                      <SortableItem
                        key={block.id}
                        id={block.id}
                        deleteButton={
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBlock(index);
                            }}
                            className="text-red-400 hover:text-red-600 ml-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
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
                        }
                      >
                        <FormBlock
                          id={block.id}
                          type={block.type}
                          index={index}
                          removeBlock={() => removeBlock(index)}
                          withDelete={false} // hide internal delete button
                        />
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

          {/* Template Blocks Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Template Blocks
            </h2>

            <div className="space-y-3">
              {templateBlocks.map((block) => (
                <div
                  key={block.id}
                  className="cursor-pointer relative group"
                  onClick={() => handleAddBlock(block.type)}
                >
                  <FormBlock id={block.id} type={block.type} isTemplate={true} />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  {/* Plus icon overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
