import React, { ReactElement, useState } from "react";
import {
  FaBarcode,
  FaImage,
  FaPen,
  FaShapes,
  FaStar,
  FaTextHeight,
} from "react-icons/fa";
import TextField from "./TextField";

const GRID_SIZE = 20;
const COMPONENT_WIDTH = 64; // Based on w-16
const COMPONENT_HEIGHT = 64; // Based on h-16

type CanvasComponent = {
  type: string;
  x: number;
  y: number;
};

const Section: React.FC = () => {
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>(
    []
  );
  const [selectedProperties, setSelectedProperties] = useState<string | null>(
    null
  );
  const [draggingCanvasComponentIndex, setDraggingCanvasComponentIndex] =
    useState<number | null>(null);
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<
    number | null
  >(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const componentsData = [
    { type: "field", icon: <FaPen /> },
    { type: "text", icon: <FaTextHeight /> },
    { type: "barcode", icon: <FaBarcode /> },
    { type: "image", icon: <FaImage /> },
    { type: "icons", icon: <FaStar /> },
    { type: "shapes", icon: <FaShapes /> },
  ];

  const handleDragStart = (component: string) => {
    setDraggedComponent(component);
  };

  const handleCanvasComponentDragStart = (index: number) => {
    setDraggingCanvasComponentIndex(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - rect.left - COMPONENT_WIDTH / 2) / zoomLevel;
    let y = (e.clientY - rect.top - COMPONENT_HEIGHT / 2) / zoomLevel;

    // Snap to grid
    x = Math.round(x / GRID_SIZE) * GRID_SIZE;
    y = Math.round(y / GRID_SIZE) * GRID_SIZE;

    // Adjust boundaries for zoom
    const adjustedWidth = rect.width / zoomLevel - COMPONENT_WIDTH;
    const adjustedHeight = rect.height / zoomLevel - COMPONENT_HEIGHT;

    // Ensure the component is fully within the boundaries of the drop area
    x = Math.max(0, Math.min(x, adjustedWidth));
    y = Math.max(0, Math.min(y, adjustedHeight));

    if (draggingCanvasComponentIndex !== null) {
      // Repositioning a component already on the canvas
      setCanvasComponents((prev) => {
        const updatedComponents = [...prev];
        updatedComponents[draggingCanvasComponentIndex].x = x;
        updatedComponents[draggingCanvasComponentIndex].y = y;
        return updatedComponents;
      });
      setDraggingCanvasComponentIndex(null);
    } else if (draggedComponent) {
      // Adding a new component from the palette
      setCanvasComponents((prev) => [
        ...prev,
        { type: draggedComponent, x, y },
      ]);
      setDraggedComponent(null);
    }
  };

  const handleComponentClick = (
    e: React.MouseEvent,
    component: string,
    index: number
  ) => {
    e.stopPropagation();
    setSelectedProperties(component);
    setSelectedComponentIndex(index);
  };

  const handleCanvasClick = () => {
    setSelectedComponentIndex(null);
  };

  const renderCanvasComponent = (type: string): ReactElement | null => {
    switch (type) {
      case "text":
        return <TextField />;
      // Add cases for other component types as you create them
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[10rem] bg-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4 mt-0">Components</h2>
        <div className="grid grid-cols-2 gap-2">
          {componentsData.map(({ type, icon }) => (
            <div
              key={type}
              draggable
              onDragStart={() => handleDragStart(type)}
              className="w-16 h-16 flex items-center justify-center bg-white rounded cursor-move"
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow bg-gray-300 p-4">
        <h2 className="text-lg font-bold mb-4">Canvas</h2>

        <div className="mb-4">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.1))}
            className="p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            -
          </button>
          <span className="mx-4 text-lg font-medium bg-gray-200 px-3 py-1 rounded-md border border-gray-300 shadow-inner">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((prev) => prev + 0.1)}
            className="p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            +
          </button>
        </div>

        <div
          className="flex items-center justify-center h-full" // Make this a flex container
          onDragOver={(e) => e.preventDefault()}
        >
          <div
            className="relative bg-gray-400 rounded-md"
            style={{
              transform: `scale(${zoomLevel})`,
              width: "500px",
              height: "250px",
              backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              backgroundPosition: `${GRID_SIZE / 2}px ${GRID_SIZE / 2}px`,
              color: "rgba(0, 0, 0, 0.1)", // Faded dots
              backgroundColor: "white",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => handleCanvasClick()}
          >
            {canvasComponents.map((component, index) => (
              <div
                key={index}
                draggable={selectedComponentIndex === index}
                style={{
                  color: "black",
                  position: "absolute",
                  left: component.x,
                  top: component.y,
                  boxShadow:
                    selectedComponentIndex === index
                      ? "0 0 0 2px blue"
                      : "none",
                }}
                onClick={(e) => handleComponentClick(e, component.type, index)}
                onDragStart={() => handleCanvasComponentDragStart(index)}
              >
                {renderCanvasComponent(component.type)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        {selectedComponentIndex !== null && (
          <div className="p-2 bg-white rounded">
            {
              componentsData.find(
                (item) =>
                  item.type === canvasComponents[selectedComponentIndex].type
              )?.icon
            }
            Type: {canvasComponents[selectedComponentIndex].type}
            {/* Add other properties as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Section;
