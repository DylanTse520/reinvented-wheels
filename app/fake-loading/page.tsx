"use client";

import Link from "next/link";

import FakeLoading from "./FakeLoading";

export default function Page() {
  return (
    <main className="flex h-screen flex-col items-center p-24">
      <div className="mb-10">
        <Link href="/">Home</Link>
      </div>
      <FakeLoading />
    </main>
  );
}
