import Link from "next/link";

interface Props {
  id: number;
  name: string;
}

export default function Card({ id, name }: Props) {
  return (
    <Link href={`/item/${id}`}>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          alt={name}
          className="mx-auto w-24 h-24 object-contain"
        />
        <h2 className="text-center capitalize mt-3 font-semibold text-gray-800 dark:text-gray-100 text-lg">
          {name}
        </h2>
      </div>
    </Link>
  );
}
