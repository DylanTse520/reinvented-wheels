"use client";

import { useEffect, useRef, useState } from "react";

const getOptions = (searchTerm: string = ""): string[] => {
  const allOptions = [
    "@John Doe",
    "@Jane Smith",
    "@Alice Johnson",
    "@Bob Williams",
    "@Emma Brown",
  ];

  if (!searchTerm) {
    return allOptions;
  }

  return allOptions.filter((option) =>
    option.slice(1).toLowerCase().includes(searchTerm.slice(1).toLowerCase())
  );
};

export default function SlackInput({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) {
  const [inputText, setInputText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [atRange, setAtRange] = useState<{
    container: Node | undefined;
    offset: number;
  }>({
    container: undefined,
    offset: -1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [nameCard, setNameCard] = useState<string>();
  const [nameCardPosition, setNameCardPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

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
        const lastAtPosition = textBeforeCursor.lastIndexOf("@");
        const charBeforeAt = textBeforeCursor.charAt(lastAtPosition - 1);

        if (
          lastAtPosition !== -1 &&
          (charBeforeAt === "" || charBeforeAt === " " || charBeforeAt === "\n")
        ) {
          setIsDropdownOpen(true);
          const searchText = textBeforeCursor.slice(lastAtPosition);
          setSearchTerm(searchText);
          setAtRange({
            container: range.startContainer,
            offset: lastAtPosition,
          });

          const rect = range.getBoundingClientRect();
          const textAreaRect = textAreaRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom - textAreaRect.top,
            left: rect.left - textAreaRect.left,
          });
        } else {
          setIsDropdownOpen(false);
          setAtRange({
            container: undefined,
            offset: -1,
          });
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
      setAtRange({
        container: undefined,
        offset: -1,
      });
    }
  };

  const highlightText = () => {
    if (!textAreaRef.current) return;
    const text = textAreaRef.current.textContent || "";
    const options = getOptions();
    const regex = new RegExp(`(${options.join("|")})\\b`, "gi");

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    text.replace(regex, (match, name, offset) => {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex, offset))
      );

      const span = document.createElement("span");
      span.className = "bg-yellow-200";
      span.textContent = match;
      span.dataset.name = name;

      fragment.appendChild(span);
      lastIndex = offset + match.length;

      return match;
    });

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textAreaRef.current.innerHTML = "";
    textAreaRef.current.appendChild(fragment);

    // Event delegation
    textAreaRef.current.addEventListener("mouseenter", handleMouseEnter, true);
    textAreaRef.current.addEventListener("mouseleave", handleMouseLeave, true);
  };

  const handleMouseEnter = (event: MouseEvent) => {
    const span = (event.target as Element).closest("span");
    if (span instanceof HTMLElement && textAreaRef.current) {
      setNameCard(span.dataset.name);
      const parentRect = textAreaRef.current.getBoundingClientRect();
      const spanRect = span.getBoundingClientRect();
      setNameCardPosition({
        top: spanRect.top - parentRect.top,
        left: spanRect.left - parentRect.left,
      });
    }
  };

  const handleMouseLeave = (event: MouseEvent) => {
    if ((event.target as Element).closest("span")) {
      setNameCard(undefined);
      setNameCardPosition(null);
    }
  };

  const handleOptionClick = (option: string) => {
    if (
      textAreaRef.current &&
      atRange.offset !== -1 &&
      atRange.container !== undefined
    ) {
      const newText = option + " ";

      const fullContent = textAreaRef.current.textContent || "";

      let absoluteOffset = atRange.offset;
      let currentNode = atRange.container;
      while (
        currentNode !== textAreaRef.current &&
        currentNode.previousSibling
      ) {
        currentNode = currentNode.previousSibling;
        absoluteOffset += currentNode.textContent?.length || 0;
      }

      const beforeInsertionPoint = fullContent.slice(0, absoluteOffset);
      const afterInsertionPoint = fullContent.slice(
        absoluteOffset + searchTerm.length
      );
      const newContent = beforeInsertionPoint + newText + afterInsertionPoint;
      setInputText(newContent);
      textAreaRef.current.textContent = newContent;

      highlightText();

      setTimeout(() => {
        if (textAreaRef.current) {
          let currentOffset = 0;
          let targetNode = null;
          let targetOffset = 0;
          const newCursorPosition = absoluteOffset + newText.length;

          const findTextNode = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              if (
                currentOffset + node.textContent!.length >=
                newCursorPosition
              ) {
                targetNode = node;
                targetOffset = newCursorPosition - currentOffset;
                return true;
              }
              currentOffset += node.textContent!.length;
            } else {
              for (const childNode of Array.from(node.childNodes)) {
                if (findTextNode(childNode)) {
                  return true;
                }
              }
            }
            return false;
          };

          findTextNode(textAreaRef.current);

          if (targetNode) {
            const newRange = document.createRange();
            const selection = window.getSelection();
            newRange.setStart(targetNode, targetOffset);
            newRange.setEnd(targetNode, targetOffset);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
          }

          textAreaRef.current.focus();
        }
      }, 0);

      setIsDropdownOpen(false);
      setAtRange({
        container: undefined,
        offset: -1,
      });
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setAtRange({
          container: undefined,
          offset: -1,
        });
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative min-h-40">
      <div
        ref={textAreaRef}
        contentEditable
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        className="absolute h-full w-full whitespace-pre-wrap break-words rounded-md border border-gray-300 bg-slate-50 p-2 text-gray-900"
      />
      {inputText === "" && (
        <div className="pointer-events-none absolute left-[9px] top-[9px] text-gray-400">
          Type your message here...
        </div>
      )}
      {nameCard && nameCardPosition && (
        <div
          className="absolute z-20 flex flex-col overflow-clip rounded border border-gray-300 bg-white text-gray-900 shadow-md"
          style={{
            top: `${nameCardPosition.top + 30}px`,
            left: `${nameCardPosition.left}px`,
          }}
        >
          <span className="bg-gray-100 px-4 py-3 font-bold leading-4">
            People
          </span>
          <span className="px-4 py-2">{nameCard.substring(1)}</span>
        </div>
      )}
      {isDropdownOpen &&
        dropdownPosition &&
        getOptions(searchTerm).length !== 0 && (
          <div
            className="absolute top-full z-10 mt-1 w-fit min-w-32 rounded-md border border-gray-300 bg-white shadow-lg"
            ref={dropdownRef}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left - 16}px`,
            }}
          >
            <ul className="py-1">
              {getOptions(searchTerm).map((option, index) => (
                <li
                  key={index}
                  className="cursor-pointer px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.substring(1)}
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
