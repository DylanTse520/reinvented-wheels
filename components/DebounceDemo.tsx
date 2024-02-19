import React from "react";

const DebounceThrottleDemo = ({
  handler,
  list,
  children,
}: {
  handler: () => void;
  list: string[];
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="rounded-full border border-solid border-gray-200 bg-gray-900 px-4 py-2 hover:bg-gray-800"
        onClick={handler}
      >
        {children}
      </button>
      <div className="flex flex-col gap-1">
        {list
          .slice(list.length - 5 > 0 ? list.length - 5 : 0)
          .map((item, i) => (
            <span key={i}>{item}</span>
          ))}
      </div>
    </div>
  );
};

export default DebounceThrottleDemo;
