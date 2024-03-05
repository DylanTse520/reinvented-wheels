"use client";

import { useEffect, useState } from "react";

export default function FakeLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const updatedProgress = Math.min(
          prevProgress + Math.random() * (prevProgress < 90 ? 10 : 1),
          100
        );
        if (updatedProgress === 100) {
          clearInterval(interval);
        }
        return updatedProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div
        className={`relative flex h-1 w-80 items-center
        overflow-hidden rounded-full bg-slate-300
        dark:bg-slate-800`}
      >
        <div
          className={`h-1 rounded-full bg-slate-900 transition-all dark:bg-lime-300`}
          style={{ width: `${progress.toFixed(2)}%` }}
        />
        {progress > 0 && (
          <div className="absolute -left-[2px] h-2 w-1 rounded-full bg-slate-900 dark:bg-lime-300" />
        )}
        {progress === 100 && (
          <div className="absolute -right-[2px] h-2 w-1 rounded-full bg-slate-900 dark:bg-lime-300" />
        )}
      </div>
      <span className="w-5">{progress.toFixed(0)}%</span>
    </div>
  );
}
