export async function getPokemonList() {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=50",
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  return res.json();
}

export async function getPokemonById(id: string) {
  if (!id) throw new Error("No Pokémon id provided");

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Pokémon not found");
  }

  return res.json();
}
