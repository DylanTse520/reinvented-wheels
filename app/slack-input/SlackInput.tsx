"use client";

import { useEffect, useRef, useState } from "react";

interface SlackInputProps {
  onSendMessage: (message: string) => void;
}

const getOptions = (searchTerm: string = ""): string[] => {
  const allOptions = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Williams",
    "Emma Brown",
  ];

  if (!searchTerm) {
    return allOptions;
  }

  return allOptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export default function SlackInput({ onSendMessage }: SlackInputProps) {
  const [inputText, setInputText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [atIndex, setAtIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInputText(newValue);

    const cursorPosition = event.currentTarget.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPosition);

    if (atIndex === -1) {
      const lastChar = textBeforeCursor.slice(-1);
      const secondLastChar = textBeforeCursor.slice(-2, -1);
      if (
        (secondLastChar === "" ||
          secondLastChar === " " ||
          secondLastChar === "\n") &&
        lastChar === "@"
      ) {
        setIsDropdownOpen(true);
        setAtIndex(cursorPosition);
      }
    } else {
      if (cursorPosition < atIndex) {
        setIsDropdownOpen(false);
        setAtIndex(-1);
      }
    }

    if (isDropdownOpen) {
      const searchText = textBeforeCursor.slice(atIndex);
      setSearchTerm(searchText);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSendMessage(inputText);
      setInputText("");
      setIsDropdownOpen(false);
      setAtIndex(-1);
    }
  };

  const handleOptionClick = (option: string) => {
    if (atIndex !== -1) {
      const newText =
        inputText.slice(0, atIndex) + option + " " + inputText.slice(atIndex);
      setInputText(newText);
      setIsDropdownOpen(false);
      setAtIndex(-1);

      const newCursorPosition = atIndex + option.length + 1;
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = newCursorPosition;
          textAreaRef.current.selectionEnd = newCursorPosition;
          textAreaRef.current.focus();
        }
      }, 0);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setAtIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textAreaRef}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="min-h-40 w-full rounded-md border border-gray-300 bg-slate-50 p-2 text-gray-900"
      />
      {isDropdownOpen && getOptions(searchTerm).length !== 0 && (
        <div
          className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg"
          ref={dropdownRef}
        >
          <ul className="py-1">
            {getOptions(searchTerm).map((option, index) => (
              <li
                key={index}
                className="cursor-pointer px-3 py-2 text-gray-900 hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
