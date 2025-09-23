import { pokemonDetailsQuery } from "@/app/shared/gql/pokemon-details";
import { fetchPokemonFromGraphQL } from "@/app/shared/utils/details-utils";
import { NextRequest, NextResponse } from "next/server";

type PokemonResponse = {
    name: string;
    flavorText: { flavor_text: string }[];
  }[];

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  // Main key with file structure based routing is the params comes from the [name] param that is wired up by the router
  // Must be at the specific route structure as: src/app/api/pokemon/details/[name]/route.ts
  const { name } = await context.params; 
  const query = pokemonDetailsQuery;
  
  try {
      // Await the results and set them to state or throw an error
      // The PokeAPI doesn't play well with casing so we set the name to lowercase to ensure that it doesn't fail based on that.
      const pokemonResults = await fetchPokemonFromGraphQL(query, { name: name.toLowerCase() });
      // To ensure that this handle multiple pokemon returned map these to an array of Pokemon data
      const mappedPokemon = pokemonResults.species.map((pokemon) => ({
        name: pokemon.name,
        flavorText: pokemon.flavorText,
      }));

      // Setup the Response to return the name and the flavorText
      return pokemonResults.species.length ? NextResponse.json<PokemonResponse>(
          mappedPokemon,
        {
          status: 200
        }
        ) : NextResponse.json<PokemonResponse>(
          [
            {
            name: `Pokemon not found for name: ${name}`,
            flavorText: [
              {
                flavor_text: ''
              }
            ]
          }
        ],
        { 
          status: 404
        }
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch(e: any ) {
        // Catch any errors and throw
        e.errors.map((error: { message: unknown; }) => {
          throw new Error(`Could Not Retrieve Pokemon. Error: ${error.message}`)
        }
      )
    }
  }