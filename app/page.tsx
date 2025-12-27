"use client";

import { useState, useEffect } from "react";
import { getPokemonList } from "@/lib/api";
import Card from "@/components/Card";

export default function HomePage() {
  const [data, setData] = useState<any>({ results: [] });
  const [loading, setLoading] = useState(true);

  // Fetch Pokémon
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPokemonList();
        setData(res);
      } catch (err) {
        setData({ results: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration-safe dark mode setup
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode, mounted]);

  // Heading color animation
  const colors = ["#dd717c", "#2A9D8F", "#264653", "#68503d", "#6A4C93"];
  const [colorIndex, setColorIndex] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setColorIndex((p) => (p + 1) % colors.length), 1000);
    return () => clearInterval(i);
  }, []);

  // Search + Sort
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const filteredPokemon = data.results
    .filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a: any, b: any) =>
      sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  // Favorites
  const [favorites, setFavorites] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    return [];
  });

  const toggleFavorite = (pokemon: any, index: number) => {
    let updatedFavs;
    const exists = favorites.find((f) => f.name === pokemon.name);
    if (exists) {
      updatedFavs = favorites.filter((f) => f.name !== pokemon.name);
    } else {
      updatedFavs = [...favorites, { ...pokemon, id: index + 1 }];
    }
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  return (
    <main className="relative min-h-screen px-4 py-8 transition-colors">
      {/* VIGNETTE */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.6))]" />

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full bg-slate-800 text-white dark:bg-slate-200 dark:text-black shadow-lg transition"
      >
        {mounted ? (darkMode ? "☀️ Light" : "🌙 Dark") : null}
      </button>

      {/* Heading */}
      <h1
        className="text-4xl font-extrabold text-center mb-2 transition-colors duration-500"
        style={{ color: colors[colorIndex] }}
      >
        OpenCatalog
      </h1>

      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Browse hundreds of Pokemon view detailed stats, save your favorites, and compare power levels all in one beautifully designed Pokedex.
      </p>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <input
          placeholder="Search Pokemon .."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur"
        >
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
        </select>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="mb-8 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-3 text-white">Favorites</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favorites.map((fav) => (
              <div key={fav.name} className="relative rounded-xl p-1 bg-gradient-to-br from-yellow-400 to-orange-500">
                <div className="rounded-xl p-4 bg-white dark:bg-gray-900">
                  <Card name={fav.name} id={fav.id} />
                  <button
                    className="absolute top-2 right-2 text-red-500 font-bold text-lg"
                    onClick={() => toggleFavorite(fav, fav.id - 1)}
                  >
                    ♥
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredPokemon.map((pokemon: any, index: number) => (
            <div
              key={pokemon.name}
              className="relative rounded-xl p-1 bg-gradient-to-br from-transparent to-transparent hover:from-pink-500 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] group"
            >
              <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur p-4 transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-pink-100 group-hover:to-indigo-100 dark:group-hover:from-gray-800 dark:group-hover:to-gray-700">
                <Card name={pokemon.name} id={index + 1} />
                <button
                  className={`absolute top-2 right-2 font-bold text-lg ${
                    favorites.find((f) => f.name === pokemon.name) ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={() => toggleFavorite(pokemon, index)}
                >
                  ♥
                </button>
                <span className="absolute top-2 left-2 text-xs font-bold bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  #{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
