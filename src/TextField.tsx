import { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const TextField: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("Text");
  const [size, setSize] = useState({ width: 200, height: 40 });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleResize = (e: any, { size }: any) => {
    e.preventDefault();
    setSize(size);
  };

  return isEditing ? (
    <textarea
      style={{ width: size.width, height: size.height }}
      className="bg-white rounded resize-none"
      value={content}
      onChange={handleContentChange}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <ResizableBox
      width={size.width}
      height={size.height}
      onResize={handleResize}
      handleSize={[20, 20]}
    >
      <div
        className="w-full h-full bg-white flex items-center justify-center rounded cursor-text"
        onDoubleClick={handleDoubleClick}
      >
        {content}
      </div>
    </ResizableBox>
  );
};

export default TextField;
