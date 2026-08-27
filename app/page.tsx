import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-10 ml-10 max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6">
      <h1 className="mb-4 text-xl font-bold text-zinc-100">Select Form</h1>
      <ul className="text-zinc-300 hover:text-indigo-400">
        <li className="text-zinc-300 hover:text-indigo-400">
          <Link href="/jades-profile">Jades</Link>
        </li>
        <li className="text-zinc-300 hover:text-indigo-400">
          <Link href="/milcoach-profile">MilCoach</Link>
        </li>
        <li className="text-zinc-300 hover:text-indigo-400">
          <Link href="/practioner-profile">Practioner</Link>
        </li>
      </ul>
    </div>
  );
}
