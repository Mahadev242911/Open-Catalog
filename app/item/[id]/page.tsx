"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPokemonById } from "@/lib/api";
import BackButton from "@/components/BackButton";

// ================= TYPE COLORS =================
const typeColors: Record<string, string> = {
  fire: "bg-red-500 text-white",
  water: "bg-blue-500 text-white",
  grass: "bg-green-500 text-white",
  electric: "bg-yellow-400 text-black",
  psychic: "bg-pink-500 text-white",
  ice: "bg-cyan-200 text-black",
  dragon: "bg-indigo-600 text-white",
  dark: "bg-gray-800 text-white",
  fairy: "bg-pink-300 text-black",
  normal: "bg-slate-400 text-white",
  fighting: "bg-rose-600 text-white",
  flying: "bg-indigo-200 text-black",
  poison: "bg-purple-500 text-white",
  ground: "bg-amber-400 text-black",
  rock: "bg-stone-500 text-white",
  bug: "bg-lime-500 text-white",
  ghost: "bg-violet-700 text-white",
  steel: "bg-gray-400 text-black",
};

// ================= STAT BAR COLOR =================
const statColor = (value: number) => {
  if (value >= 100) return "from-green-400 to-green-600";
  if (value >= 70) return "from-yellow-400 to-orange-500";
  return "from-red-500 to-pink-500";
};

export default function PokemonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ===== DARK MODE =====
  const [darkMode, setDarkMode] = useState(false);

  // ===== FAVORITE =====
  const [favorite, setFavorite] = useState(false);

  // ===== DARK MODE LOAD =====
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // ===== FETCH POKÉMON =====
  useEffect(() => {
    if (!id) return;

    async function fetchPokemon() {
      const data = await getPokemonById(id);
      setPokemon(data);

      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorite(favs.some((p: any) => p.id === data.id));

      setLoading(false);
    }

    fetchPokemon();
  }, [id]);

  // ===== FAVORITE HANDLER =====
  const handleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (favorite) {
      const updated = favs.filter((p: any) => p.id !== pokemon.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setFavorite(false);
    } else {
      const updated = [
        ...favs,
        {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.front_default,
        },
      ];
      localStorage.setItem("favorites", JSON.stringify(updated));
      setFavorite(true);
    }
  };

  // ===== COMPARE HANDLER =====
  const handleCompare = () => {
    router.push(`/compare?id=${pokemon.id}`);
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!pokemon) {
    return <p className="text-center mt-20">Pokémon not found</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8
      bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.15),transparent_45%)]
      dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.25),transparent_45%),linear-gradient(to_bottom,#020617,#020617)]
      transition-colors">

      {/* VIGNETTE */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.6))]" />

      {/* DARK MODE TOGGLE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full
        bg-slate-800 text-white dark:bg-slate-200 dark:text-black
        shadow-lg transition"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <BackButton />

      {/* ================== POKEMON CARD ================== */}
      <div className="group relative backdrop-blur-xl rounded-3xl p-10 max-w-md w-full
        bg-white/70 dark:bg-slate-800/70
        border border-white/20 dark:border-white/10
        shadow-[0_30px_60px_rgba(0,0,0,0.5)]
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_40px_80px_rgba(0,0,0,0.7)]">

        {/* IMAGE */}
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="mx-auto w-40 h-40
          drop-shadow-[0_0_20px_rgba(99,102,241,0.7)]
          transition-transform duration-300 group-hover:scale-110"
        />

        {/* NAME */}
        <h1 className="text-3xl font-bold capitalize text-center mt-6
          bg-gradient-to-r from-indigo-400 to-pink-400
          bg-clip-text text-transparent">
          {pokemon.name}
        </h1>

        {/* HEIGHT / WEIGHT */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="rounded-xl bg-white/60 dark:bg-slate-700/60 p-4 text-center
            shadow-inner border border-white/20">
            <p className="text-xs uppercase">Height</p>
            <p className="text-xl font-semibold">{pokemon.height}</p>
          </div>
          <div className="rounded-xl bg-white/60 dark:bg-slate-700/60 p-4 text-center
            shadow-inner border border-white/20">
            <p className="text-xs uppercase">Weight</p>
            <p className="text-xl font-semibold">{pokemon.weight}</p>
          </div>
        </div>

        {/* TYPES */}
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          {pokemon.types.map((t: any) => (
            <span
              key={t.type.name}
              className={`px-4 py-1 rounded-full text-sm font-semibold
              shadow-[0_0_12px_rgba(255,255,255,0.35)]
              transition group-hover:brightness-110
              ${typeColors[t.type.name]}`}
            >
              {t.type.name}
            </span>
          ))}
        </div>

        {/* STATS */}
        <div className="mt-8 space-y-4">
          {pokemon.stats.map((stat: any) => (
            <div key={stat.stat.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{stat.stat.name}</span>
                <span>{stat.base_stat}</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${statColor(stat.base_stat)}
                  animate-[grow_0.6s_ease-out]`}
                  style={{ width: `${Math.min(stat.base_stat, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleFavorite}
            className="w-full py-2 rounded-xl
            bg-gradient-to-r from-red-500 to-pink-500
            text-white shadow-lg hover:brightness-110 transition"
          >
            {favorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
          </button>

          <button
            onClick={handleCompare}
            className="w-full py-2 rounded-xl
            bg-white/80 dark:bg-slate-200
            text-black shadow-lg hover:bg-white transition"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
