// Minimal HTML5 drag-to-reorder for a flat list. Used for modules, sections,
// and content blocks in the course builder.
//
// The trick: a card is only `draggable` while its grip handle is held
// (mousedown on the handle flips `enabled`). That keeps text inputs inside the
// card selectable the rest of the time — a fully-draggable card hijacks every
// text selection.
import { useState } from "react";

export function useReorder<T>(items: T[], onChange: (next: T[]) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  const reset = () => {
    setDragIndex(null);
    setOverIndex(null);
    setEnabled(false);
  };

  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  // Spread onto each reorderable item's wrapper.
  const itemProps = (index: number) => ({
    draggable: enabled,
    onDragStart: (e: React.DragEvent) => {
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
    },
    onDragOver: (e: React.DragEvent) => {
      if (dragIndex === null) return;
      e.preventDefault();
      if (overIndex !== index) setOverIndex(index);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragIndex !== null) move(dragIndex, index);
      reset();
    },
    onDragEnd: reset,
  });

  // Spread onto the grip handle inside each item.
  const handleProps = {
    onMouseDown: () => setEnabled(true),
    onMouseUp: () => setEnabled(false),
    onMouseLeave: () => {
      // Only release if a drag never started.
      if (dragIndex === null) setEnabled(false);
    },
  };

  const state = (index: number) => ({
    dragging: dragIndex === index,
    over: overIndex === index && dragIndex !== index,
  });

  return { itemProps, handleProps, state };
}
