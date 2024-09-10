import React from "react";

interface DropdownProps {
  options: string[];
  handleOptionClick: (option: string) => void;
  dropdownPosition: { top: number; left: number };
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  handleOptionClick,
  dropdownPosition,
  dropdownRef,
}) => {
  return (
    <div
      className="absolute top-full z-10 mt-1 w-fit min-w-32 rounded-md border border-gray-300 bg-white shadow-lg"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left - 16}px`,
      }}
      ref={dropdownRef}
    >
      <ul className="py-1">
        {options.map((option, index) => (
          <li
            key={index}
            className="cursor-pointer px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
