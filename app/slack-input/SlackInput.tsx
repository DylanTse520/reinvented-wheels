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
  const [atRange, setAtRange] = useState<Range | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const textAreaRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = () => {
    if (textAreaRef.current) {
      const newValue = textAreaRef.current.textContent || "";
      setInputText(newValue);

      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const content = range.startContainer.textContent;
        const cursorPosition = range.startOffset;
        const textBeforeCursor = content
          ? content.substring(0, cursorPosition)
          : "";

        if (atRange === undefined) {
          const lastChar = textBeforeCursor.slice(-1);
          const secondLastChar = textBeforeCursor.slice(-2, -1);
          if (
            (secondLastChar === "" ||
              secondLastChar === " " ||
              secondLastChar === "\n") &&
            lastChar === "@"
          ) {
            setIsDropdownOpen(true);
            setAtRange(range);
          }
        } else {
          if (cursorPosition < atRange.startOffset) {
            setIsDropdownOpen(false);
            setAtRange(undefined);
          }
        }

        if (isDropdownOpen) {
          const searchText = textBeforeCursor.slice(atRange?.startOffset);
          setSearchTerm(searchText);
        }
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSendMessage(inputText);
      setInputText("");
      if (textAreaRef.current) {
        textAreaRef.current.textContent = "";
      }
      setIsDropdownOpen(false);
      setAtRange(undefined);
    }
  };

  const handleOptionClick = (option: string) => {
    if (textAreaRef.current && atRange !== undefined) {
      const newText = option + " ";
      atRange.insertNode(document.createTextNode(newText));
      atRange.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(atRange);
      textAreaRef.current.focus();
      const newValue = textAreaRef.current.textContent || "";
      setInputText(newValue);
      setIsDropdownOpen(false);
      setAtRange(undefined);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setAtRange(undefined);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={textAreaRef}
        contentEditable
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        className="min-h-40 w-full whitespace-pre rounded-md border border-gray-300 bg-slate-50 p-2 text-gray-900"
      />
      {(inputText === "" || inputText === undefined) && (
        <div className="pointer-events-none absolute left-[9px] top-[9px] text-gray-400">
          Type your message here...
        </div>
      )}
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
