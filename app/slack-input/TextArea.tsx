import React from "react";

interface TextAreaProps {
  handleInputChange: () => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  textAreaRef: React.RefObject<HTMLDivElement>;
  inputText: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  handleInputChange,
  handleKeyDown,
  textAreaRef,
  inputText,
}) => {
  return (
    <>
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
    </>
  );
};

export default TextArea;
