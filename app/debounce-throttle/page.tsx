"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import DebounceThrottleDemo from "@/components/DebounceThrottleDemo";

import { debounce, throttle } from "@/utils/debounce-throttle";

export default function Page() {
  const [listA, setListA] = useState<string[]>([]);
  const [listB, setListB] = useState<string[]>([]);
  const [listC, setListC] = useState<string[]>([]);
  const [listD, setListD] = useState<string[]>([]);
  const [listE, setListE] = useState<string[]>([]);

  const handlerA = useCallback(
    debounce(() => {
      setListA((prev) => [...prev, "Clicked " + (prev.length + 1)]);
    }),
    []
  );
  const handlerB = useCallback(
    debounce(
      () => {
        setListB((prev) => [...prev, "Clicked " + (prev.length + 1)]);
      },
      500,
      { leading: true, trailing: false }
    ),
    []
  );
  const handlerC = useCallback(
    debounce(
      () => {
        setListC((prev) => [...prev, "Clicked " + (prev.length + 1)]);
      },
      500,
      { leading: true, trailing: true }
    ),
    []
  );

  const handlerD = useCallback(
    throttle(() => {
      setListD((prev) => [...prev, "Clicked " + (prev.length + 1)]);
    }),
    []
  );
  const handlerE = useCallback(
    throttle(
      () => {
        setListE((prev) => [...prev, "Clicked " + (prev.length + 1)]);
      },
      500,
      { trailing: false }
    ),
    []
  );

  return (
    <main className="flex h-screen flex-col items-center p-24">
      <div className="mb-10">
        <Link href="/">Home</Link>
      </div>
      <div className="flex flex-1 gap-8">
        <DebounceThrottleDemo handler={handlerA} list={listA}>
          Debounce trailing
        </DebounceThrottleDemo>
        <DebounceThrottleDemo handler={handlerB} list={listB}>
          Debounce leading
        </DebounceThrottleDemo>
        <DebounceThrottleDemo handler={handlerC} list={listC}>
          Debounce leading and trailing
        </DebounceThrottleDemo>
      </div>
      <div className="flex flex-1 gap-8">
        <DebounceThrottleDemo handler={handlerD} list={listD}>
          Throttle trailing on
        </DebounceThrottleDemo>
        <DebounceThrottleDemo handler={handlerE} list={listE}>
          Throttle trailing off
        </DebounceThrottleDemo>
      </div>
    </main>
  );
}
