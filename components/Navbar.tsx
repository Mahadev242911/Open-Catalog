import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
        <Link href="/" className="font-bold text-xl">
          OpenCatalog
        </Link>
      </div>
    </nav>
  );
}
