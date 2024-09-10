import React from "react";

interface NameCardProps {
  name: string;
  position: {
    top: number;
    left: number;
  } | null;
}

const NameCard: React.FC<NameCardProps> = ({ name, position }) => {
  if (!position) return null;

  return (
    <div
      className="absolute z-20 flex flex-col overflow-clip rounded border border-gray-300 bg-white text-gray-900 shadow-md"
      style={{
        top: `${position.top + 30}px`,
        left: `${position.left}px`,
      }}
    >
      <span className="bg-gray-100 px-4 py-3 font-bold leading-4">People</span>
      <span className="px-4 py-2">{name}</span>
    </div>
  );
};

export default NameCard;
