import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <Link href="/debounce-throttle">Debounce and throttle demo</Link>
      <Link href="/typing-effect">Typing effect demo</Link>
    </main>
  );
}
