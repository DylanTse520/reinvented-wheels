"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import TypingEffect from "./TypingEffect";

export default function Page() {
  return (
    <main className="flex h-screen flex-col items-center p-24">
      <div className="mb-10">
        <Link href="/">Home</Link>
      </div>
      <TypingEffect sentence="Typing, as your thoughts flow." />
    </main>
  );
}
