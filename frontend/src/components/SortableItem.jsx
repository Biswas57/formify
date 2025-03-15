import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ id, children, deleteButton }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    flexShrink: 0, // Prevents the item from shrinking or expanding
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      {/* Draggable content area: full block is draggable with pointer cursor */}
      <div className="flex-1 cursor-pointer" {...attributes} {...listeners}>
        {children}
      </div>
      {/* Delete button rendered outside the draggable area */}
      <div>{deleteButton}</div>
    </div>
  );
}
