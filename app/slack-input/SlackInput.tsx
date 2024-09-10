"use client";

import { useEffect, useRef, useState } from "react";

import Dropdown from "./Dropdown";
import NameCard from "./NameCard";
import TextArea from "./TextArea";
import { getOptions, highlightText } from "./helper";

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

      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range) {
        const startNode = range.startContainer;
        const parentSpan = startNode.parentElement;
        if (
          parentSpan &&
          parentSpan.tagName === "SPAN" &&
          parentSpan.classList.contains("bg-yellow-200") &&
          parentSpan.textContent?.slice(1) !== parentSpan.dataset.name
        ) {
          const textNode = document.createTextNode(
            parentSpan.textContent || ""
          );
          parentSpan.parentNode?.replaceChild(textNode, parentSpan);

          const newRange = document.createRange();
          newRange.setStart(textNode, (parentSpan.textContent || "").length);
          newRange.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
          setNameCard(undefined);

          const rect = newRange.getBoundingClientRect();
          const textAreaRect = textAreaRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom - textAreaRect.top,
            left: rect.left - textAreaRect.left,
          });
        } else {
          const content = startNode.textContent;
          const cursorPosition = range.startOffset;
          const textBeforeCursor = content
            ? content.substring(0, cursorPosition)
            : "";
          const lastAtPosition = textBeforeCursor.lastIndexOf("@") + 1;
          const charBeforeAt = textBeforeCursor.charAt(lastAtPosition - 2);

          if (
            lastAtPosition !== 0 &&
            (charBeforeAt === "" ||
              charBeforeAt === " " ||
              charBeforeAt === "\n")
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

      highlightText({
        node: textAreaRef.current,
        handleMouseEnter,
        handleMouseLeave,
      });

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
      <TextArea
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        textAreaRef={textAreaRef}
        inputText={inputText}
      />
      {nameCard && nameCardPosition && (
        <NameCard name={nameCard} position={nameCardPosition} />
      )}
      {isDropdownOpen &&
        dropdownPosition &&
        getOptions(searchTerm).length !== 0 && (
          <Dropdown
            options={getOptions(searchTerm)}
            handleOptionClick={handleOptionClick}
            dropdownPosition={dropdownPosition}
            dropdownRef={dropdownRef}
          />
        )}
    </div>
  );
}
