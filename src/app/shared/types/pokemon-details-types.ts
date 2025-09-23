export type PokemonSearchParameter = Record<string, string>
export interface PokemonDetails {
  species: {
    name: string;
    base_happiness: number | null;
    is_legendary: boolean;
    is_mythical: boolean;
    generation: { name: string } | null;
    habitat: { name: string } | null;
    pokemon: {
      nodes: {
        height: number | null;
        name: string;
        id: number;
        weight: number | null;
        abilities: {
          nodes: { ability: { name: string } }[];
        };
        stats: {
          base_stat: number;
          stat: { name: string };
        }[];
        types: {
          slot: number;
          type: { name: string };
        }[];
        levelUpMoves: {
          nodes: {
            move: { name: string };
            level: number | null;
          }[];
        };
        foundInAsManyPlaces: {
          aggregate: { count: number } | null;
        };
        fireRedItems: {
          item: { name: string; cost: number | null };
          rarity: number | null;
        }[];

      }[];

    }; flavorText: {
      flavor_text: string;
    }[];
  }[];
}